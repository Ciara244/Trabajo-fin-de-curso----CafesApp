import React from "react";
import { useHistory } from "react-router-dom";

export default function Exit({navi}) {
    const nav = useHistory();

    return (
        <button id="exit" onClick={() => nav.push(navi)}>X</button>
    )
}