import React, { useContext }  from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { useHistory } from "react-router-dom";

/* COMPONENTS */


function Workers() {
    const { user } = useContext(UserLogin);
    const nav = useHistory();

    return (
        <div className={'padre'}>
            <div className={"cuerpo"}>
                <h1>Chambeamos aqui</h1>
                <p>#{user?.id ?? "ERROR"}</p>
                <button className={"blueButton"} onClick={() => nav.push("/tabs/settings")}>Salir</button>
            </div>
        </div>
    )
}

export default Workers;