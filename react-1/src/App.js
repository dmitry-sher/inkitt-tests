import React, { Component } from 'react'
// import logo from './logo.svg'
import Select from 'react-select'
import './App.css'
import 'react-select/dist/react-select.css'

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
                  options={[
                    { value: 'one', label: 'One' },
                    { value: 'two', label: 'Two' }
                  ]}
                />
              </div>
            </div>
          </div>
        )
    }
}

export default App
