var _throttle
var _blurThrottle
var _throttleTimeout = 150
var networkDelay = 5000

function tplStr(tpl, data) {
    var re = /\{([^}]+)?\}/g
    var match
    while (match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl
}

function genId() {
    var l = 8
    var a = 'abcdefghjklmnopqrstuvzxyz0123456789'
    var ret = []
    for (var i = 0; i < l; i++) ret.push(a.substr(Math.floor(Math.random() * a.length), 1))
    return ret.join('')
}

var template = [
    '<div id="select-{id}" class="select">',
    '<h4 id="title-{id}">{title}</h4>',
    '<div id="input-div-{id}" class="input">',
    '<input type="text" name="{id}" id="input-{id}" />',
    '<div id="label-{id}"></div>',
    '<img src="img/loader.gif" class="spinner hidden" id="spinner-{id}"></i>',
    '<div class="menu" id="menu-{id}"></div>',
    '</div>',
    '</div>'
].join('')

// data for emulating loader

var states = [
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

var statesOptions = states.map(function(s, i) { return { value: i, text: s } })
function getFilteredOptions(filter) {
    var re = new RegExp(escapeRegExp(filter), 'i')
    return statesOptions.filter(function(option) { return option.text.match(re) })
}

function escapeRegExp(str) {
    return str.replace(/[.^$*+?()[{\\|\]-]/g, '\\$&')
}

function typeaheadSelect(id, config) {
    var self = {}
    self.el = $$(id)
    if (!self.el) {
        console.warn('failed to init typeaheadSelect on ', id)
        return
    }

    self.init = function(config) {
        // set up internals
        self.config = config
        self.id = self.config.id || genId()
        self._caches = {}
        self.data = {
            id: self.id,
            title: config.title
        }
        self.state = {
            opened: false,
            search: '',
            value: '',
            focused: false,
            filteredOptions: [],
            async: false,
            loading: false
        }
        if (typeof config.options === 'function') self.state.async = true

        // initial render
        self.el.innerHTML = tplStr(template, self.data)
        setTimeout(self.init2, 0)
    }

    self.setState = function(state, cb) {
        var keys = Object.keys(state)
        for (var i = 0; i < keys.length; i++) self.state[keys[i]] = state[keys[i]]
        self.stateChanged()
        if (cb) cb()
    }

    self.init2 = function() {
        // set up dom links
        self._label = $$('label-' + self.id)
        self._inputDiv = $$('input-div-' + self.id)
        self._input = $$('input-' + self.id)
        self._icon = $$('spinner-' + self.id)
        self._menu = $$('menu-' + self.id)
        self._title = $$('title-' + self.id)
        self._wrapper = $$('select-' + self.id)

        // hide title if necessary
        if (!self.config.title) addClass(self._title, 'hidden')

        // init menu
        self._menuComponent = typeaheadSelectMenu('menu-' + self.id, {
            options: self.state.filteredOptions,
            onChooseOption: self.onChooseOption
        })

        // set up event handlers
        self._label.addEventListener('click', self.onLabelClick)
        self._input.addEventListener('focus', self.onFocus)
        self._input.addEventListener('blur', self.onBlur)
        self._input.addEventListener('keyup', self.onChange)
        self._input.addEventListener('change', self.onChange)
        self._input.addEventListener('keydown', self.onKeyDown)
    }

    self.onLabelClick = function() {
        if (self._input) self._input.focus()
    }

    self.onFocus = function(e) {
        var opened = !!self.state.value
        // if (self._menu) self._menu.clearSelectedIndex()
        self.setState({ focused: true, opened: opened })
    }

    self.onBlur = function(e) {
        clearTimeout(_blurThrottle)
        _blurThrottle = setTimeout(function() {
            self.setState({ focused: false, opened: false }, function() {
                if (self.config.onClose) self.config.onClose()
            })
        }, _throttleTimeout)
    }

    self.getOptions = function(filter) {
        if (!filter) filter = ''
        var options = self.config.options
        var optionsArray = options
        if (filter) {
            var re = new RegExp(escapeRegExp(filter), 'i')
            optionsArray = options.filter(function(option) { return option.text.match(re) })
        }
        return optionsArray
    }

    self.onChange = function(e) {
        var value = e.target.value
        clearTimeout(_throttle)
        _throttle = setTimeout(function() { self.onChangeReal(value) }, _throttleTimeout)
    }

    self.reinitMenu = function() {
        self._menuComponent.setState({ options: self.state.filteredOptions })
        self._menuComponent.render()
        self._menuComponent.openMenu()
    }

    self.onChangeReal = function(value, opened) {
        if (!opened) opened = true
        if (self.state.value === value) return
        // if (self._menu) self._menu.clearSelectedIndex()
        if (self.state.async) {
            self.setState({
                value: value,
                opened: true
            }, function() {
                // if (self.props.onOpen) self.props.onOpen()
                self.loadAsyncOptions(value)
            })
            return
        }

        self.setState({
            value: value,
            filteredOptions: self.getOptions(value),
            opened: true
        }, self.reinitMenu)
    }

    self.loadAsyncOptions = function(filter) {
        if (!filter) filter = ''
        clearTimeout(self._async)
        if (self._caches[filter]) {
            self.setState({ loading: false, filteredOptions: self._caches[filter] }, self.reinitMenu)
            return
        }
        self.setState({ loading: true }, function() {
            const delay = Math.floor(Math.random() * networkDelay)
            self._async = setTimeout(function() {
                const getFilteredOptions = self.config.options
                const options = getFilteredOptions(filter)
                self._caches[filter] = options
                self.setState({ loading: false, filteredOptions: options }, self.reinitMenu)
            }, delay)
        })
    }

    self.onChooseOption = function(option) {
        self.setState({ selectedValue: option.text })
    }

    self.stateChanged = function() {
        var selectedValue = self.state.selectedValue || ''
        var opened = self.state.opened
        var focused = self.state.focused
        var loading = self.state.loading

        var selectClasses = ['select']
        if (opened) selectClasses.push('open')

        var menuClasses = ['menu']
        if (opened) menuClasses.push('open')

        var labelClasses = ['label']
        if (opened || focused) labelClasses.push('hidden')

        var inputClasses = ['input']
        if (opened || focused) inputClasses.push('open')

        var spinnerClasses = ['spinner']
        if (!loading) spinnerClasses.push('hidden')

        self._wrapper.className = selectClasses.join(' ')
        self._menu.className = menuClasses.join(' ')
        self._label.className = labelClasses.join(' ')
        self._inputDiv.className = inputClasses.join(' ')
        self._icon.className = spinnerClasses.join(' ')

        self._label.innerHTML = selectedValue
    }

    self.init(config)
    return self
}
