import React, { Component } from 'react'
// import logo from './logo.svg'
import Select from './components/Select.jsx'
import './App.css'

const states = [
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

const statesOptions = states.map((s, i) => ({ value: i, text: s }))

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
                Here's a little example of react-select that i've made.<br />
                Features:
                <ul>
                  <li>simple list filtering</li>
                  <li>keyboard navigation</li>
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
