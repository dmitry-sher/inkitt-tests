import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SelectMenu from './SelectMenu'
import Icon from './Icon'
import { escapeRegExp } from '../lib/data'

// The arch is simple:
//  we show input field for user to start entering
//  currently selected value is absolutely-positioned overlay. on click we hide it and transfer focus to input
//  possible values are shown in menu

let _throttle
let _blurThrottle
const _throttleTimeout = 150
const networkDelay = 5000

export default class Select extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        value: PropTypes.string,
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
        this.setState({ loading: true }, () => {
            const delay = Math.floor(Math.random() * networkDelay)
            setTimeout(() => {
                const getFilteredOptions = this.props.options
                const options = getFilteredOptions(filter)
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
            }, () => this.loadAsyncOptions(value))
            return
        }

        this.setState({
            value,
            filteredOptions: this.getOptions(value),
            opened: true
        })
    }

    onChooseOption = (option) => {
        const { onChange, name } = this.props
        if (onChange) {
            onChange(name, option)
            this.setState({ opened: false })
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
            this.setState({ focused: false, opened: false })
        , _throttleTimeout)
    }

    onOpenMenu = () => this.setState({ opened: true })

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

        const menuClasses = ['menu']
        if (opened) menuClasses.push('open')

        const labelClasses = ['label']
        if (opened || focused) labelClasses.push('hidden')

        const inputClasses = ['input']
        if (opened || focused) inputClasses.push('open')

        return (
          <div className="select">
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
