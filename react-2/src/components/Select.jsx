import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SelectMenu from './SelectMenu'

// The arch is simple:
//  we show input field for user to start entering
//  currently selected value is absolutely-positioned overlay. on click we hide it and transfer focus to input
//  possible values are shown in menu

let _throttle
let _blurThrottle
const _throttleTimeout = 150

function escapeRegExp(str) {
    return str.replace(/[.^$*+?()[{\\|\]-]/g, '\\$&')
}

export default class Select extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        value: PropTypes.string,
        options: PropTypes.oneOfType([PropTypes.array, PropTypes.func])
    }

    state = {
        opened: false,
        search: '',
        value: '',
        focused: false,
        filteredOptions: []
    }

    componentDidMount () {
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

    onChange = (e) => {
        const { target: { value } } = e
        clearTimeout(_throttle)
        _throttle = setTimeout(() => this.onChangeReal(value), _throttleTimeout)
    }

    onChangeReal = (value, opened = true) => {
        if (this.state.value === value) return
        this.setState({
            value,
            filteredOptions: this.getOptions(value),
            opened: true,
            selectedIndex: -1
        })
    }

    onChooseOption = (option) => {
        if (this.props.onChange) {
            this.props.onChange(option)
            this.setState({ opened: false })
            if (this._input) this._input.blur()
            return
        }
        this.setState({ value: option })
        if (this._input) this._input.blur()
    }

    onFocus = (e) => {
        const opened = !!this.state.value
        this.setState({ focused: true, opened, selectedIndex: -1 })
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
        const { value, filteredOptions, opened, focused } = this.state

        const menuClasses = ['menu']
        if (opened) menuClasses.push('open')

        const labelClasses = ['label']
        if (opened || focused) labelClasses.push('hidden')

        const inputClasses = ['input']
        if (opened || focused) inputClasses.push('open')

        return (
          <div className="select">
            <div className={labelClasses.join(' ')} onClick={this.onLabelClick}>{value && value.text}</div>
            <div className={inputClasses.join(' ')}>
                <input
                    type="text"
                    onKeyUp={this.onChange}
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyDown}
                    value={this.search}
                    ref={c => this._input = c}
                />
            </div>

            <SelectMenu
                onChooseOption={this.onChooseOption}
                options={filteredOptions}
                opened={opened}
                value={value}
                onOpenMenu={this.onOpenMenu}
                onClear={this.onClear}
                ref={c => this._menu = c}
            />
          </div>
        )
    }
}
