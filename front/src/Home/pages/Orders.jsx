import React, { useContext, useEffect, useState } from "react";
import "../style/import.css";
import { UserLogin } from "../js/UserId";
import { IonContent, IonPage } from "@ionic/react";

/* COMPONENTS */
import Order from "../ionic/Order";
import Selector from "../ionic/Selector";

function Orders() {
    const { user } = useContext(UserLogin);
    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);

    const id = user?.id;
    const nonWorker = (id >= 1000);

    //------------------------FUNCTIONS---------------------------------//
    useEffect(() => {
        fetchDataOrder();
        if (nonWorker) {
            num();
        }
    }, []);

    //Collect data from the database
    async function fetchDataOrder() {
        try {
            const result = await fetch("backend");
            const data = await result.json();
            setOrders(data);
        } catch (error) {
            console.error("Error");
        }
    }

    //This function is just to inform the user how many orders they had placed.
    const num = () => {
        setTotalOrders(document.getElementsByClassName(id).length);
    }

    return (
        <IonPage>
            <IonContent className={"contentBackground"}>
                <div className={'padre'}>
                    <div className={"cuerpo"}>
                        <div className={"orderCenter"}>
                            {(id === "Admin00") &&
                                <div className={"selectorSchool"}>
                                    <Selector />
                                </div>
                            }
                            {!nonWorker &&
                                <>
                                    {orders.map((order) => (
                                        <Order key={order.id} order={order} />
                                    ))}
                                    <Order order={1} id={id}/>
                                    <Order order={1} id={id}/>
                                    <Order order={1} id={id}/>
                                </>
                            }
                            {nonWorker &&
                                <>
                                    <p>Pedidos activos: {totalOrders ?? 0}</p>
                                    {orders.map((userOrder) => (
                                        <Order key={userOrder.id} order={userOrder} />
                                    ))}
                                    <Order order={1} id={id}/>
                                    <Order order={1} id={id}/>
                                    <Order order={1} id={id}/>
                                    <Order order={1} id={id}/>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default Orders;