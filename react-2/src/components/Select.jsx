import React, { Component } from 'react'
import PropTypes from 'prop-types'

// The arch is simple:
//  we show input field for user to start entering
//  currently selected value is absolutely-positioned overlay. on click we hide it and transfer focus to input
//  possible values are shown in menu

let _throttle
const _throttleTimeout = 150
const keyUp = 38
const keyDown = 40
const keyEnter = 13
const keyEsc = 27

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
        filteredOptions: [],
        selectedIndex: -1
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
            optionsArray = options.filter(option => option.value.match(re))
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

    onChooseOption = (option, cb) => {
        if (this.props.onChange) {
            this.props.onChange(option.value)
            this.setState({ opened: false }, cb)
            return
        }
        this.setState({ value: option.value }, cb)
    }

    onFocus = (e) => {
        const opened = !!this.state.value
        this.setState({ focused: true, opened, selectedIndex: -1 })
    }

    onBlur = (e) => {
        this.setState({ focused: false, opened: false })
    }

    onKeyDown = (e) => {
        const { selectedIndex, value, filteredOptions } = this.state
        if (e.keyCode === keyDown) {
            if (!value) {
                // we simply open menu
                this.setState({ opened: true })
            }
            this.setState({ selectedIndex: Math.min(selectedIndex + 1, filteredOptions.length - 1) })
            return
        }
        if (e.keyCode === keyUp) {
            this.setState({ selectedIndex: Math.max(selectedIndex - 1, 0) })
            return
        }
        if (e.keyCode === keyEnter) {
            // choose option
            if (selectedIndex > -1 && filteredOptions[selectedIndex]) {
                this.onChooseOption(filteredOptions[selectedIndex], () => {
                    if (this._input) this._input.blur()
                })
                // this.setState({
                //     focused: false
                // }, () => {
                    
                // })
            }
            return
        }
        if (e.keyCode === keyEsc) {
            // clear everything
            this.onChangeReal('', false)
            return
        }
        console.log('onkeydown ', e.keyCode)
    }

    onLabelClick = (e) => {
        if (this._input) this._input.focus()
    }

    render() {
        const { value, filteredOptions, opened, focused, selectedIndex } = this.state

        const menuClasses = ['menu']
        if (opened) menuClasses.push('open')

        const labelClasses = ['label']
        if (opened || focused) labelClasses.push('hidden')

        const inputClasses = ['input']
        if (opened || focused) inputClasses.push('open')

        return (
          <div className="select">
            <div className={labelClasses.join(' ')} onClick={this.onLabelClick}>{value}</div>
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

            <div className={menuClasses.join(' ')}>
            {filteredOptions.map((option, i) => (
                <div
                    onClick={() => this.onChooseOption(option)}
                    key={`item-${option.value}`}
                    className={i === selectedIndex ? 'selected' : ''}
                >{option.text}</div>
            ))}
            </div>
          </div>
        )
    }
}
