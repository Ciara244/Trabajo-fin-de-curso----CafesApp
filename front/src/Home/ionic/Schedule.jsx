import React from 'react';
import { IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/react';

export default function Schedule() {
  return (
    <div>
      <IonList>
        <IonItem>
          <IonSelect interface="action-sheet" placeholder="Seleccione su turno">
            <IonSelectOption value="morning">Mañana</IonSelectOption>
            <IonSelectOption value="afternoon">Tarde</IonSelectOption>
            <IonSelectOption value="night">Nocturno</IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>
    </div>
  );
}