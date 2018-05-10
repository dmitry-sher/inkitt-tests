import React, { Component } from 'react'
// import logo from './logo.svg'
import Select from 'react-select'
import './App.css'
import 'react-select/dist/react-select.css'

// data for emulating loader

export const states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
]

export const statesOptions = states.map((s, i) => ({ value: i, label: s }))

class App extends Component {
    state = {
        value: ''
    }

    onChange = (value) => this.setState({ value })

    render() {
        const { value } = this.state
        return (
            <div className="App">
                <div className="flexy">
                    <div className="left">
                Here's a little example of really nice React-select package.<br />
                We are using 1.2.1 version, 'cause 2.0 is not yet production-ready.<br />
                It has a lot of useful features:
                        <ul>
                            <li>single-select</li>
                            <li>multi-select</li>
                            <li>creatable select</li>
                            <li>custom render</li>
                            <li>async</li>
                            <li>and more!</li>
                        </ul>
                    </div>
                    <div className="right">
                        <Select
                            name="form-field-name"
                            value={value}
                            onChange={this.onChange}
                            options={statesOptions}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default App
