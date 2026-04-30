import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow } from '@ionic/react';

export default function Card({ data }) {
    const nav = useHistory();

    return (
        <IonCard className={"cardProduct"} onclick={() => nav.push("/product", {product:data})}>
            <IonGrid>
                <IonRow>
                    <ion-col size="6">
                        <img alt={data.name ?? "Producto"} src={data.photo} />
                    </ion-col>

                    <ion-col size="4">
                        <IonCardHeader>
                            <IonCardTitle><h1>{data.name ?? "Nombre generico"}</h1></IonCardTitle>
                            <IonCardContent><p>{data.allergens ?? "Alergeno"}</p></IonCardContent>
                            <IonCardContent><p>{data.category ?? "Categoria generico"}</p></IonCardContent>

                        </IonCardHeader>
                    </ion-col>
                    <ion-col size="2" className="precio">
                        <IonCardContent><p><b>{data.price ?? 0} €</b></p></IonCardContent>
                    </ion-col>

                </IonRow>
            </IonGrid>
        </IonCard>
    );
}