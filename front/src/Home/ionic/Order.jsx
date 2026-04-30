import React from 'react';
import { IonCard } from '@ionic/react';

export default function Order({ order, id }) {
    return (
        <IonCard className={"cardOrder " + order.school +" "+ id}>
            <div className="orderContainer">
                <div className="orderLeft">
                    <h1>Usuario: {order.user ?? "John Doe"} - Id: {order.userId ?? "?"}</h1>
                    <h2>Productos:</h2>
                    <ul>
                        <li><p>{order.name ?? "producto"}</p></li>
                    </ul>
                    <h2>Extra:</h2>
                    <ul>
                        <li><p>{order.extra ?? "No"}......{order.extraPrice ?? 0} €</p></li>
                    </ul>
                </div>
                <div className="orderRight">
                    <p className="priceOrder"><var>{order.price ?? 0}</var> €</p>
                </div>
            </div>
        </IonCard>
    );
}
