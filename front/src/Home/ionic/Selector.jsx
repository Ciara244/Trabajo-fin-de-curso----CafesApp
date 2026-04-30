import React from 'react';
import { IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/react';

export default function Selector() {
  return (
    <div>
      <IonList>
        <IonItem>
          <IonSelect interface="action-sheet" placeholder="Seleccione el colegio">
            <IonSelectOption value="joseZerpa">José Zerpa</IonSelectOption>
            {/*Inserte colegios: <IonSelectOption value="example">Example</IonSelectOption> */}
          </IonSelect>
        </IonItem>
      </IonList>
    </div>
  );
}