import React, { Component } from 'react'
// import logo from './logo.svg'
import Select from './components/Select.jsx'
import './App.css'
import 'font-awesome/css/font-awesome.css'
import { getFilteredOptions, statesOptions } from './lib/data'

class App extends Component {
    state = {
        value1: '',
        value2: '',
        opened: false
    }

    onChange = (name, value) => this.setState({ [name]: value })

    onOpen = () => this.setState({ opened: true })
    onClose = () => this.setState({ opened: false })

    render() {
        const { value1, value2, opened } = this.state
        const classes = ['App']
        if (opened) classes.push('open')

        return (
            <div className={classes.join(' ')}>
                <div className="flexy">
                    <div className="left">
                        Here's a little example of react-select that i've made.<br />
                        Features:
                        <ul>
                            <li>simple list filtering</li>
                            <li>keyboard navigation</li>
                            <li>async / FP mode</li>
                            <li>simple caching/memoization</li>
                        </ul>
                    </div>
                    <div className="right">
                        <Select
                            name="value1"
                            value={value1}
                            onChange={this.onChange}
                            options={statesOptions}
                            title="Synced"
                            onOpen={this.onOpen}
                            onClose={this.onClose}
                        />

                        <Select
                            name="value2"
                            value={value2}
                            onChange={this.onChange}
                            options={getFilteredOptions}
                            title="Async"
                            onOpen={this.onOpen}
                            onClose={this.onClose}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default App
