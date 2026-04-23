import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import "../style/import.css";

/* COMPONENTS */
import TextInput from "../components/input/Input";
import Radio from "../components/input/Radio";
import Selector from "../ionic/Selector";
import Schedule from "../ionic/Schedule";

/* RESOURCES */
import tick from "../../resources/img/tick.webp";
import * as CheckInput from "../js/checkInputs";
import Alert from "../ionic/Alert";

function Register() {
    const nav = useHistory();
    
    const [leer, setLeer] = useState(false); //Make visible or invisible to see the div "absolute"
    var [enable, setEnable] = useState(true); //Enable or disable the button to register in the app.
    
    //-----------------------FUNCTIONS---------------------------//
    //When the user click on "Términos" this will make appear the div "absolute"
    function terms() {
        setLeer(true);
    }
    //When the user is done, then they would click in "agree" that hides the div. Making enable to check in the checkbox.
    function ok() {
        setLeer(false);
        const checkIn = document.getElementById("agree");
        checkIn.disabled = false;
    
        checkIn.classList.remove("disabled");
    }
    //If the user check or uncheck the checkbox this will trigger this function. Making enabled or disabled the button of register.
    function buttonRegister() {
        const checkIn = document.getElementById("agree");
    
        const buttonIn = document.getElementById("allow");
        if (checkIn.checked) {
            setEnable(false);
            buttonIn.classList.remove("disabled");
        } else {
            setEnable(true);
            buttonIn.classList.add("disabled");
        }
    }

    function loadRegister () {
            const result = CheckInput.Adding("/")
    
            if (!result.bol) {
                return;
            }
    
            nav.push(result.navi);
        }
    //------------------------------------------------------------------//
    
    return (
        <div className={'inicio'}>
            <Alert />
            <h1>REGISTRO</h1>
            <TextInput txt="Nombre" valor="text" id="Name" />
            <TextInput txt="Contraseña" valor="password" id="Password" />
            <div className={'line'}>
                <h5>Rol:</h5>
                <Radio txt="alumno" name="rol"/>
                <Radio txt="profesor" name="rol"/>
            </div>
            <div className={'line'}>
                <h5>Colegio:</h5>
                <Selector />
            </div>
            <div className={'line'}>
                <h5>Horario:</h5>
                <Schedule />
            </div>
            <div className={"checkStyle"}>
                <input type="checkbox" id="agree" className="disabled" onChange={() => buttonRegister()} disabled/>
                <div className={"checkmark"} />
                <p>Estoy de acuerdo con los <b onClick={() => terms()}>términos.</b></p>
            </div>


            <button onClick={() => loadRegister()} className={"brownButton disabled"} id={"allow"} disabled={enable}>REGISTRARSE</button>
            <button onClick={() => {nav.push("/")}} className={"brownButton"}>VOLVER</button>

            {leer && <div className={"absolute"}>
                <h1>¡ATENCIÓN!</h1>
                <p>Al registrarse aseguras lo siguiente:</p>
                <ul>
                    <li>Eres un estudiante o profesorado activo del centro. Por lo tanto, si haces un pago en el colegio el centro educativo no se hará responsable de la perdida monetaria en caso de no estar matrículado.</li>
                    <li>La institución no se hará responsable por pedidos falsos, una vez que pages no se devolverá el dinero.</li>
                    <li>Cuando realices un pedido y hayas pagado, independientemente de que recogas el pedido o no, el pago se dará por efectuado. No se admiten devoluciones una vez que el pedido haya sido solicitado y pagado.</li>
                    <li>Si la persona que recoga el pedido no coincide con la identidad proporcionada a la hora de registro, se penalizará con una sanción y su cuenta será eliminada.</li>
                </ul>
                <p>Si estás de acuerdo con estos términos puede continuar:</p>
                <button onClick={() => ok()} className={"brownButton"}><img src={tick} alt="tick"/> ACEPTAR</button>
            </div> }

        </div>
    )

}

export default Register;