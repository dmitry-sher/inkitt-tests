import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SelectMenu from './SelectMenu'
import Icon from './Icon'
import { escapeRegExp } from '../lib/data'

// The arch is simple:
//  we show input field for user to start entering
//  currently selected value is absolutely-positioned overlay. on click we hide it and transfer focus to input
//  possible values are shown in menu
//  keyboard nav is handled by menu class
//  async loading incorporated in this one

let _throttle
let _blurThrottle
const _throttleTimeout = 150
const networkDelay = 5000

export default class Select extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
        title: PropTypes.string,
        options: PropTypes.oneOfType([PropTypes.array, PropTypes.func])
    }

    constructor(props) {
        super(props)

        this.state = {
            opened: false,
            search: '',
            value: '',
            focused: false,
            filteredOptions: [],
            async: false,
            loading: false
        }
        this._caches = {}

        if (typeof props.options === 'function') this.state.async = true
    }

    componentDidMount () {
        const { async } = this.state
        if (async) {
            this.loadAsyncOptions()
            return
        }
        this.setState({ filteredOptions: this.getOptions() })
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.value) this.setState({ value: nextProps.value })
    }

    getOptions(filter = '') {
        const { options } = this.props
        let optionsArray = (typeof options === 'function') ? options() : options
        if (filter) {
            const re = new RegExp(escapeRegExp(filter), 'i')
            optionsArray = options.filter(option => option.text.match(re))
        }
        return optionsArray
    }

    // simple network emulating stub
    loadAsyncOptions(filter = '') {
        clearTimeout(this._async)
        if (this._caches[filter]) {
            this.setState({ loading: false, filteredOptions: this._caches[filter] })
            return
        }
        this.setState({ loading: true }, () => {
            const delay = Math.floor(Math.random() * networkDelay)
            this._async = setTimeout(() => {
                const getFilteredOptions = this.props.options
                const options = getFilteredOptions(filter)
                this._caches[filter] = options
                this.setState({ loading: false, filteredOptions: options })
            }, delay)
        })
    }

    onChange = (e) => {
        const { target: { value } } = e
        clearTimeout(_throttle)
        _throttle = setTimeout(() => this.onChangeReal(value), _throttleTimeout)
    }

    onChangeReal = (value, opened = true) => {
        if (this.state.value === value) return
        if (this._menu) this._menu.clearSelectedIndex()
        if (this.state.async) {
            this.setState({
                value,
                opened: true
            }, () => {
                if (this.props.onOpen) this.props.onOpen()
                this.loadAsyncOptions(value)
            })
            return
        }

        this.setState({
            value,
            filteredOptions: this.getOptions(value),
            opened: true
        }, () => {
            if (this.props.onOpen) this.props.onOpen()
        })
    }

    onChooseOption = (option) => {
        const { onChange, name } = this.props
        if (onChange) {
            onChange(name, option)
            this.setState({ opened: false }, () => {
                if (this.props.onClose) this.props.onClose()
            })
            if (this._input) this._input.blur()
            return
        }
        this.setState({ value: option })
        if (this._input) this._input.blur()
    }

    onFocus = (e) => {
        const opened = !!this.state.value
        if (this._menu) this._menu.clearSelectedIndex()
        this.setState({ focused: true, opened })
    }

    onBlur = (e) => {
        clearTimeout(_blurThrottle)
        _blurThrottle = setTimeout(() =>
            this.setState({ focused: false, opened: false }, () => {
                if (this.props.onClose) this.props.onClose()
            })
            , _throttleTimeout)
    }

    onOpenMenu = () => this.setState({ opened: true }, () => {
        if (this.props.onOpen) this.props.onOpen()
    })

    onClear = () => this.onChangeReal('', false)

    onLabelClick = (e) => {
        if (this._input) this._input.focus()
    }

    onKeyDown = (e) => {
        if (this._menu) this._menu.onKeyDown(e)
    }

    render() {
        const { value, filteredOptions, opened, focused, loading } = this.state
        const { name, title } = this.props

        const selectClasses = ['select']
        if (opened) selectClasses.push('open')

        const menuClasses = ['menu']
        if (opened) menuClasses.push('open')

        const labelClasses = ['label']
        if (opened || focused) labelClasses.push('hidden')

        const inputClasses = ['input']
        if (opened || focused) inputClasses.push('open')

        return (
            <div className={selectClasses.join(' ')}>
                {title && (<h4>{title}</h4>)}
                <div className={inputClasses.join(' ')}>
                    <input
                        type="text"
                        name={name}
                        onKeyUp={this.onChange}
                        onChange={this.onChange}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onKeyDown={this.onKeyDown}
                        value={this.search}
                        ref={c => this._input = c}
                    />
                </div>
                <div className={labelClasses.join(' ')} onClick={this.onLabelClick}>{value && value.text}</div>
                <Icon icon="spinner" className={['spinner', loading ? '' : 'hidden'].join(' ')} />

                <SelectMenu
                    onChooseOption={this.onChooseOption}
                    options={filteredOptions}
                    opened={opened}
                    value={value}
                    loading={loading}
                    onOpenMenu={this.onOpenMenu}
                    onClear={this.onClear}
                    ref={c => this._menu = c}
                />
            </div>
        )
    }
}
