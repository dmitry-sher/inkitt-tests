function typeaheadSelectMenu(id, config) {
    var self = {}
    self.el = $$(id)
    if (!self.el) {
        console.warn('failed to init typeaheadSelectMenu on ', id)
        return
    }

    self.init = function(config) {
        // set up internals
        self.config = config
        self.id = self.config.id || genId()
        self.data = {
            id: self.id
        }
        self.state = {
            selectedIndex: -1,
            options: config.options
        }

        // initial render
        self.el.innerHTML = ''
        setTimeout(self.init2, 0)
    }

    self.init2 = function() {
        self.el.addEventListener('click', self.onClick)

        self.render()
    }

    self.onClick = function(e) {
        // console.log(e.target)
        var idx = e.target.getAttribute('data-idx')
        if (typeof idx == 'undefined') return
        var opt = self.state.options[+idx]
        if (self.config.onChooseOption) self.config.onChooseOption(opt)
    }

    self.setState = function(state, cb) {
        var keys = Object.keys(state)
        for (var i = 0; i < keys.length; i++) self.state[keys[i]] = state[keys[i]]
        // self.stateChanged()
        if (cb) cb()
    }

    self.render = function() {
        var options = self.state.options
        var htmls = []
        for (var i = 0; i < options.length; i++) {
            htmls.push([
                '<div id="option', options[i].value, '" data-id="', options[i].value, '" ',
                'data-idx="', i, '">',
                options[i].text,
                '</div>'
            ].join(''))
        }
        self.el.innerHTML = htmls.join('')
    }

    self.openMenu = function() {
        addClass(self.el, 'open')
    }

    self.closeMenu = function() {
        removeClass(self.el, 'open')
    }

    self.init(config)
    return self
}
