import React from 'react'

export default (props) => {
    return (
        <button onClick={props.function}>{props.text}</button>
    )
}