import React, { useContext } from "react";
import { useHistory } from 'react-router-dom';
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { IonContent, IonPage } from "@ionic/react";

/* COMPONENTS */

function Settings() {
    const nav = useHistory();
    const { user } = useContext(UserLogin);
    const { logOut } = useContext(UserLogin);

    //------------------------------------------------------//
    //fontSize modifier
    const { setFontSize } = useContext(UserLogin);
    //Functions to modify the fontSize of the App.
    const x1 = () => {
        setFontSize(prev => 1);
    };
    const x2 = () => {
        setFontSize(prev => 1.1);
    };
    const x3 = () => {
        setFontSize(prev => 1.2);
    };

    //color modifier
    const { setColor } = useContext(UserLogin);
    //Functions to modify the background color of the App.
    const light = () => {
        setColor(prev => "#ead8ca");
    };
    const dark = () => {
        setColor(prev => "#b88f74");
    };
    //------------------------------------------------------//

    return (
        <IonPage>
            <IonContent className={"contentBackground"}>
                <div className={'padre'}>
                    <div className={"cuerpo"}>
                        <div className={"box"}>
                            <div>
                                <p>Id:</p>
                                <p id="id">#{user?.id ?? "ERROR"}</p>
                            </div>
                            {user?.id === "Admin00" &&
                                <>
                                    <div className={"line2"} />

                                    <div>
                                        <p>Modificar trabajadores:</p>
                                        <div className={"buttons"}>
                                            <button className={"blueButton"} onClick={() => nav.push("/workers")}>Editar</button>
                                        </div>
                                    </div>
                                </>
                            }
                            <div className={"line2"} />
                            <div>
                                <p>Tamaño de las letras:</p>
                                <div className={"buttons"}>
                                    <button className={"blueButton"} onClick={x1}>x1</button>
                                    <button className={"blueButton"} onClick={x2}>x2</button>
                                    <button className={"blueButton"} onClick={x3}>x3</button>
                                </div>
                            </div>
                            <div className={"line2"} />
                            <div>
                                <p>Fondo:</p>
                                <div className={"buttons"}>
                                    <button className={"blueButton"} onClick={light}>Claro</button>
                                    <button className={"blueButton"} onClick={dark}>Oscuro</button>
                                </div>
                            </div>
                            <div className={"line2"} />
                            <div>
                                <button onClick={() => { logOut(); nav.push("/"); }} className={"brownButton"}>Cerrar sesión</button>
                            </div>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Settings;