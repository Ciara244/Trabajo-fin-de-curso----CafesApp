import React, { useContext, useEffect } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { IonIcon } from "@ionic/react";
import { useHistory } from "react-router-dom";

/* COMPONENTS */
import Header from "../components/Header";
import Exit from "../components/Exit";

import { cartOutline, closeOutline } from 'ionicons/icons';

function Cart() {
    const nav = useHistory();

    const { user, priceUser, setPriceUser } = useContext(UserLogin);

    //--------------------FUNCTIONS-----------------------//

    useEffect(() => {
        const prices = document.getElementsByTagName("var");
        var aux = 0;
        for (let i of prices ) {
            aux += parseFloat(i.innerText);
        }
        setPriceUser(Number(aux.toFixed(2)));
    });

    function cancel () {
        //Por ahora solo vuelve para atrás. Más adelante quitará también todos los pedidos.
        
        nav.push("/tabs/menu")
    }
    return (
        <div className={'padre'}>
            <Header user={user} />
            <div className={"cuerpo"}>
                <div className={"cart"}>
                    <Exit navi={"/tabs/menu"} />
                    <h1>Pedidos</h1>
                    <div id="orders">
                        <ul>
                            <li><p>Comida</p><p><var>4.00</var> €</p></li>
                            <li><p>Comida</p><p><var>1.99</var> €</p></li>
                            <li><p>Comida</p><p><var>5.00</var> €</p></li>
                            <li><p>Comida</p><p><var>1.00</var> €</p></li>
                            <li><p>Comida</p><p><var>1.00</var> €</p></li>
                            <li><p>Comida</p><p><var>3.00</var> €</p></li>
                            <li><p>Comida</p><p><var>1.30</var> €</p></li>
                            <li><p>Comida</p><p><var>1.00</var> €</p></li>
                            <li><p>Comida</p><p><var>1.00</var> €</p></li>
                            <li><p>Comida</p><p><var>2.20</var> €</p></li>
                            <li><p>Comida</p><p><var>2.20</var> €</p></li>
                        </ul>
                    </div>
                    <h3>Extras:</h3>
                    <div id="extras">
                        <ul>
                            <li><p>No</p><p><var>0</var> €</p></li>
                        </ul>
                    </div>
                    <h3>Total: <span id="price">{priceUser ?? "ERROR"} €</span></h3>
                    <div className={"buttonsPrice"}>
                        <button className={"aquaButton"} onClick={() => nav.push("/payment")}><IonIcon icon={cartOutline}/>Pagar</button>
                        <button className={"aquaButton"}  onClick={() => cancel()}><IonIcon icon={closeOutline}/>Limpiar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart;