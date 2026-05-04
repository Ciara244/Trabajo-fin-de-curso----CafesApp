import React, { useContext } from "react";
import { IonIcon } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { UserLogin } from "../js/UserId";

/* RESOURCES */
import { funnelOutline, bagHandle } from 'ionicons/icons';

export default function Header({ user, menu }) {
    const nav = useHistory();
    const { basket } = useContext(UserLogin);

    return (
        <div className={"cabecera"}>
            {menu ? <IonIcon icon={funnelOutline} /> : <div id="divSpace"></div>}
            {user?.id >= 1000 &&
                <>
                    <div className={"basket"} onClick={() => nav.push("/cart")}>
                        <p>{basket}</p>
                        <IonIcon icon={bagHandle} />
                    </div>
                </>
            }
            {user?.id === "Admin00" &&
                <>
                    <div>
                        <button className={"brownButton"} onClick={() => nav.push("/add")}>Añadir</button>
                        <button className={"brownButton"}>Borrar</button>
                    </div>
                </>
            }
        </div>
    )
}
