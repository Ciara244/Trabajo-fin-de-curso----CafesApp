import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow } from '@ionic/react';

export default function Card({ product }) {
    return (
        <IonCard>
            <IonGrid>
                <IonRow>
                    <ion-col size="6">
                        <img alt={product.name} src={product.photo} />
                    </ion-col>
                    
                        <ion-col size="4">
                            <IonCardHeader>
                                <IonCardTitle><h1>{product.name}</h1></IonCardTitle>
                                <IonCardContent><p>{product.allergens}</p></IonCardContent>
                                <IonCardContent><p>{product.category}</p></IonCardContent>

                            </IonCardHeader>
                        </ion-col>
                        <ion-col size="2" className="precio">
                            <IonCardContent><p><b>{product.price} €</b></p></IonCardContent>
                        </ion-col>
                    
                </IonRow>
            </IonGrid>
        </IonCard>
    );
}