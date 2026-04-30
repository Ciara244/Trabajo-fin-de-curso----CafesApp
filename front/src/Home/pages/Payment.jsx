import React, { useContext } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { IonIcon } from "@ionic/react";
import { useHistory } from "react-router-dom";

/* COMPONENTS */
import Header from "../components/Header";
import Exit from "../components/Exit";
import TextInput from "../components/input/Input";
import RadioInput from "../components/input/Radio";
import Alert from "../ionic/Alert";

/* RESOURCES */
import * as CheckInput from "../js/checkInputs";

import { checkmarkOutline, logIn } from 'ionicons/icons';

function Payment() {
    const nav = useHistory();

    const { user, priceUser } = useContext(UserLogin);

    //--------------------FUNCTIONS-----------------------//
    function pay() {
        const result = CheckInput.PaymentProcess("/tabs/menu")

        if (!result.bol) {
            return;
        }

        nav.push(result.navi);
    }

    return (
        <div className={'padre'}>
            <Header user={user} />
            <div className={"cuerpo"}>
                <div className={"cart"}>
                    <Alert />
                    <Exit navi={"/tabs/menu"} />
                    <h1>Pagar</h1>
                    <TextInput txt="Número de la tarjeta" valor="text" id="Tarjeta" />
                    <TextInput txt="Fecha de caducidad" valor="text" id="Caducidad" />
                    <TextInput txt="Titular de la tarjeta" valor="text" id="Titular" />
                    <TextInput txt="CVV" valor="text" id="CVV" />
                    <h3>Emisor de la tarjeta:</h3>

                    <div className={"buttonsPrice"}>
                        <RadioInput txt="Visa" name="emisor" />
                        <RadioInput txt="MasterCard" name="emisor" />
                    </div>

                    <h3>Total: <span id="price">{priceUser ?? "ERROR"} €</span></h3>

                    <div className={"buttonsPrice"}>
                        <button className={"aquaButton"} onClick={() => pay()}><IonIcon icon={checkmarkOutline} />Confirmar</button>
                        <button className={"aquaButton"} onClick={() => nav.push("/cart")}><IonIcon icon={logIn} />Regresar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment;