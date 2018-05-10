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
    var ret
    for (var i = 0; i < l; i++) ret.push(a.substr(Math.floor(Math.random() * a.length), 1))
    return ret.join('')
}

var template = [
    '<div id="select-{id}" class="select">',
    '<h4 id="title-{id}">{title}</h4>',
    '<div id="input-div-{id}" class="input">',
    '<input type="text" name="{id}" id="input-{id}"/>',
    '<div id="label-{id}"></div>',
    '<i class="fa fa-spinner" id="spinner-{id}" />',
    '<div class="menu" id="menu-{id}"></div>',
    '</div>',
    '</div>'
].join('')

function typeaheadSelect(id, config) {
    var self = this
    this.el = $$(id)
    if (!this.el) {
        console.warn('failed to init typeaheadSelect on ', id)
        return
    }

    this.init = function(config) {
        // set up internals
        self.config = config
        self.id = self.config.id || genId()
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

    this.setState = function(state, cb) {
        var keys = Object.keys(state)
        for (var i = 0; i < keys.length; i++) self.state[keys[i]] = state[keys[i]]
        self.stateChanged()
        if (cb) cb()
    }

    this.init2 = function() {
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

        // set up event handlers
        self._label.addEventListener('click', self.onLabelClick)
        self._input.addEventListener('focus', self.onFocus)
        self._input.addEventListener('blur', self.onBlur)
    }

    this.onLabelClick = function() {
        if (self._input) self._input.focus()
    }

    this.onFocus = function(e) {
        const opened = !!self.state.value
        // if (self._menu) this._menu.clearSelectedIndex()
        self.setState({ focused: true, opened: opened })
    }

    this.onBlur = function(e) {
        clearTimeout(_blurThrottle)
        _blurThrottle = setTimeout(() =>
            self.setState({ focused: false, opened: false }, () => {
                if (self.config.onClose) self.config.onClose()
            })
            , _throttleTimeout)
    }

    this.stateChanged = function() {
        var value = self.state.value
        var filteredOptions = self.state.filteredOptions
        var opened = self.state.opened
        var focused = self.state.focused
        var loading = self.state.loading
        var name = self.config.name
        var title = self.config.title

        var selectClasses = ['select']
        if (opened) selectClasses.push('open')

        var menuClasses = ['menu']
        if (opened) menuClasses.push('open')

        var labelClasses = ['label']
        if (opened || focused) labelClasses.push('hidden')

        var inputClasses = ['input']
        if (opened || focused) inputClasses.push('open')

        self._wrapper.className = selectClasses.join(' ')
        self._menu.className = menuClasses.join(' ')
        self._label.className = labelClasses.join(' ')
        self._inputDiv.className = inputClasses.join(' ')
    }

    this.init(config)
    return this
}
