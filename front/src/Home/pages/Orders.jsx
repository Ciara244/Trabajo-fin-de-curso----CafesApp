import React, { useContext } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { IonContent, IonPage } from "@ionic/react";

/* COMPONENTS */
import Order from "../ionic/Order";

function Orders() {
    const { user } = useContext(UserLogin);

    return (
        <IonPage>
            <IonContent className={"contentBackground"}>
                <div className={'padre'}>
                    <div className={"cuerpo"}>
                        {(user?.id < 1000 || user?.id === "Admin00") &&
                            <div className={"orderCenter"}>
                                <p>Sos trabajador</p>
                                <Order order={1} />
                                <Order order={1} />
                                <Order order={1} />
                            </div>
                        }
                        {user?.id >= 1000 &&
                            <>
                                <div className={"orderCenter"}>
                                    <p>Sos Alumno</p>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Orders;