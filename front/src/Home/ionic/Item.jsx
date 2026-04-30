import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow } from '@ionic/react';

export default function Card({ data }) {
    
    if (!data) return null;

    return (
        <IonCard>
            <IonGrid>
                <IonRow>
                    <ion-col size="6">
                        <img alt={data.nombre} src={data.imagen} style={{ width: '100%', objectFit: 'cover' }} />
                    </ion-col>
                    
                    <ion-col size="4">
                        <IonCardHeader>
                            <IonCardTitle><h1>{data.nombre}</h1></IonCardTitle>
                            
                            {/* Hemos quitado alergenos temporalmente porque es un objeto JSON */}
                            <IonCardContent><p>{data.categoria}</p></IonCardContent>
                        </IonCardHeader>
                    </ion-col>
                    
                    <ion-col size="2" style={{ display: 'flex', justifyContent: 'center' }}>
                        <IonCardContent>
                             <p style={{ margin: 0, fontSize: '1.1rem' }}><b>{data["precio_€"]} €</b></p>
                        </IonCardContent>
                    </ion-col>
                    
                </IonRow>
            </IonGrid>
        </IonCard>
    );
}