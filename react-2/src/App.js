import React, { Component } from 'react'
// import logo from './logo.svg'
import Select from './components/Select.jsx'
import './App.css'
import 'font-awesome/css/font-awesome.css'
import { getFilteredOptions, statesOptions } from './lib/data'

class App extends Component {
    state = {
        value1: '',
        value2: ''
    }

    onChange = (name, value) => this.setState({ [name]: value })

    render() {
        const { value1, value2 } = this.state
        return (
            <div className="App">
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
                        />

                        <Select
                            name="value2"
                            value={value2}
                            onChange={this.onChange}
                            options={getFilteredOptions}
                            title="Async"
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default App
