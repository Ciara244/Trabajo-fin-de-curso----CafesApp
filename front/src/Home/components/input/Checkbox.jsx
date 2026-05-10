import React from "react";

function CheckboxInput({ txt, name, group }) {
    return (
        <li>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input 
                    type="checkbox" 
                    name={group} 
                    value={name} 
                />
                <span style={{ textTransform: 'capitalize' }}>{txt}</span>
            </label>
        </li>
    );
}

export default CheckboxInput;