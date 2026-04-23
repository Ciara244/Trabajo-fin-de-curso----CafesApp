import React from 'react'

export default function RadioInput ({txt, name}) {
    return (
        <div>
            <input type="radio"  id={txt}  name={name} value={txt}/>
            <label for={txt}>{txt}</label>
        </div>
    )
}