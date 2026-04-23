import React from 'react'

export default function Cancel ({value}) {
    return (
        <div className={"cancelSpace"}>
            <button onClick={() => clean()} className={"cancel"}>X</button>
        </div>
    )

    function clean() {
        const text = document.getElementById(value);
        text.value = "";
    }
}