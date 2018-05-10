// compat
function detectBrowsers() {
    var classes = []
    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        classes.push('safari')
    }

    if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) && (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i))) {
        classes.push('mobileSafari')
    }

    if (navigator.userAgent.match(/iPad/i)) {
        classes.push('iPad')
    }

    if (navigator.userAgent.match(/iPhone/i)) {
        classes.push('iPhone')
    }

    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        classes.push('firefox')
    }

    if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
        classes.push('android')
    }

    if (!!window.chrome && !!window.chrome.webstore) {
        classes.push('chrome')
    }

    if (Function('/*@cc_on return document.documentMode===10@*/')()) {
        classes.push('ie10')
    }

    if (!!window.MSInputMethodContext && !!document.documentMode) {
        classes.push('ie11')
    }

    document.body.className = classes.join(' ')
}

function isDevice() {
    return isIpad() || isIphone() || isAndroid()
}

function isIpad() {
    return document.body.className.match(/iPad/)
}

function isAndroid() {
    return document.body.className.match(/android/)
}

function isIphone() {
    return document.body.className.match(/iPhone/)
}

function ipadOrient() {
    document.addEventListener('DOMContentLoaded', function(event) {
        window.addEventListener('orientationchange', function(e) {
            onOrient()
        })
    })
}

function windowWidth() {
    return Math.max(
        document.documentElement['clientWidth'],
        document.body['scrollWidth'],
        document.documentElement['scrollWidth'],
        document.body['offsetWidth'],
        document.documentElement['offsetWidth']
    )
}

function windowHeight() {
    return Math.max(
        document.documentElement['clientHeight'],
        document.body['scrollHeight'],
        document.documentElement['scrollHeight'],
        document.body['offsetHeight'],
        document.documentElement['offsetHeight']
    )
}

function addClass(el, cls) {
    if (!el || !cls) return
    var classStr = el.className
    var classes = classStr.split(' ').filter(function(c) { return !!c })
    if (classes.indexOf(cls) != -1) return
    classes.push(cls)
    el.className = classes.join(' ')
}

function removeClass(el, cls) {
    if (!el || !cls) return
    var classStr = el.className
    var classes = classStr.split(' ').filter(function(c) { return !!c })
    var idx = classes.indexOf(cls)
    if (idx == -1) return
    classes.splice(idx, 1)
    el.className = classes.join(' ')
}

function $$(id) {
    return document.getElementById(id)
}

function onOrient(initial) {
    var wdth = windowWidth()
    var hght = windowHeight()
    if (window.orientation == 90 || window.orientation == -90 || wdth >= hght) {
        addClass(document.body, 'landscape')
        removeClass(document.body, 'portrait')
    } else {
        addClass(document.body, 'portrait')
        removeClass(document.body, 'landscape')
    }
    setTimeout(function() {
        // do on orient work
    }, 50)
}

function startup() {
    detectBrowsers()
    ipadOrient()
    onOrient(true)
}

startup()
