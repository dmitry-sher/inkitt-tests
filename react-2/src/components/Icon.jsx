import React from 'react'

const Icon = ({ icon, className }) => {
    const classes = ['fa', `fa-${icon}`]
    if (className) classes.push(className)
    return (
        <i className={classes.join(' ')} />
    )
}

export default Icon
