import React, { useContext } from "react";
import { useHistory } from 'react-router-dom';
import "./style/import.css";

/* COMPONENTS */
import TextInput from "./components/input/Input";
import { UserLogin } from "./js/UserId";
import Alert from "./ionic/Alert";

/* RESOURCES */
import img from "../resources/img/LogoCafe.webp";
import * as CheckInput from "./js/checkInputs";

function HomePage() {
    const nav = useHistory();

    const { login } = useContext(UserLogin); //For the current user information.

    //-------------------------FUNCTION---------------------------//
    //Login for the user. This function checks if the user exists and then save up the information to use it later.
    function loadLogin () {
        //Borrar-----------
        const id = document.getElementById("Id").value;
        //-----------------

        const result = CheckInput.Login("/tabs/menu", id)

        if (!result.bol) {
            return;
        }

        login(result.user);
        nav.push(result.navi);
    }
    //--------------------------------------------------------------//

    return (
        <div className={'inicio'}>
            <Alert />
            <img src={img} alt="Café" id="cafeBackground"/>
            <TextInput txt="Id" valor="text" id="Id" />
            <TextInput txt="Contraseña" valor="password" id="Password" />

            <button onClick={() => loadLogin()} className={"brownButton"}>INICIAR SESIÓN</button>
            <button onClick={() => {nav.push("/register")}} className={"brownButton"}>REGISTRARSE</button>
        </div>
    )
}



export default HomePage