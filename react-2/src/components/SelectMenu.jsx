import React, { Component } from 'react'
import PropTypes from 'prop-types'

const keyUp = 38
const keyDown = 40
const keyEnter = 13
const keyEsc = 27

export default class SelectMenu extends Component {
    static propTypes = {
        onChooseOption: PropTypes.func.isRequired,
        options: PropTypes.array.isRequired,
        opened: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onOpenMenu: PropTypes.func.isRequired,
        onClear: PropTypes.func.isRequired
    }

    state = {
        selectedIndex: -1
    }

    onChooseOption = (option, cb) => {
        this.props.onChooseOption(option, cb)
    }

    onKeyDown = (e) => {
        const { value, options, opened } = this.props
        const { selectedIndex } = this.state
        if (e.keyCode === keyDown) {
            if (!value || !opened) {
                // we open menu
                this.props.onOpenMenu()
            }
            this.setState({ selectedIndex: Math.min(selectedIndex + 1, options.length - 1) })
            return
        }
        if (e.keyCode === keyUp) {
            if (!value || !opened) {
                // we open menu
                this.props.onOpenMenu()
            }
            this.setState({ selectedIndex: Math.max(selectedIndex - 1, 0) })
            return
        }
        if (e.keyCode === keyEnter) {
            // choose option
            if (selectedIndex > -1 && options[selectedIndex]) {
                this.onChooseOption(options[selectedIndex])
            }
            return
        }
        if (e.keyCode === keyEsc) {
            // clear everything
            this.props.onClear()
            return
        }
        console.log('onkeydown ', e.keyCode)
    }

    clearSelectedIndex = () => this.setState({ selectedIndex: -1 })

    render() {
        const { options, opened, loading } = this.props
        const { selectedIndex } = this.state

        const menuClasses = ['menu']
        if (opened && !loading) menuClasses.push('open')

        return (
            <div className={menuClasses.join(' ')}>
                {options.map((option, i) => (
                    <div
                        onClick={() => this.onChooseOption(option)}
                        key={`item-${option.value}`}
                        className={i === selectedIndex ? 'selected' : ''}
                    >{option.text}</div>
                ))}
                {opened && !loading && !options.length && `no items found`}
            </div>
        )
    }
}
