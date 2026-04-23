import React from 'react'
import Cancel from './Cancel';

export default function TextInput ({txt, valor, id}) {
    return (
        <div className={"input"}>
            <p>{txt}</p>
            <div className={"backgroundInput"}>
                <input type={valor}  id={id} placeholder='Texto...'/>
                <Cancel value={id}/>
            </div>
        </div>
    )
}