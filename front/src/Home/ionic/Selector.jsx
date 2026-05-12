import React from 'react';
import { IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/react';

export default function Selector() {
  return (
    <div>
      <IonList>
        <IonItem>
          <IonSelect interface="action-sheet" placeholder="Seleccione el colegio">
            <IonSelectOption value="joseZerpa">IES José Zerpa</IonSelectOption>
            <IonSelectOption value="santaLucia">IES Santa Lucia</IonSelectOption>
            <IonSelectOption value="vecindario">IES Doctoral</IonSelectOption>
            {/*Inserte colegios: <IonSelectOption value="example">Example</IonSelectOption> */}
          </IonSelect>
        </IonItem>
      </IonList>
    </div>
  );
}