import React from 'react'

export default function CheckboxInput({ txt, name, group }) {
    return (
        <div className={group}>
            <input type="checkbox" value={txt} name={group} />
            <label for={txt}>{name}</label>
        </div>
    )
}