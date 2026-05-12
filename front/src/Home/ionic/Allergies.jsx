import React, { useState } from 'react';
import { IonItem, IonList, IonSelect, IonSelectOption } from '@ionic/react';

export default function Allergies({onChange}) {
    const [selected, setSelected] = useState([]);

    const handleChange = (e) => {
        const values = e.detail.value;
        setSelected(values);
        if (onChange) {
            onChange(values);
        }
    };

    return (
        <div>
            <IonList>
                <IonItem>
                    <IonSelect aria-label="Alergias" value={selected} placeholder="Seleccione sus alergias (si no tienes no selecciones)" multiple={true} onIonChange={handleChange}>
                        <IonSelectOption value="cacahuete">Cacahuete</IonSelectOption>
                        <IonSelectOption value="pescado">Pescado</IonSelectOption>
                        <IonSelectOption value="lacteo">Lacteo</IonSelectOption>
                        <IonSelectOption value="huevo">Huevo</IonSelectOption>
                        <IonSelectOption value="gluten">Gluten</IonSelectOption>
                        <IonSelectOption value="fruto de cascara">Fruto de cáscara</IonSelectOption>
                        <IonSelectOption value="mostaza">Mostaza</IonSelectOption>
                        <IonSelectOption value="granos de sésamo">Granos de sésamo</IonSelectOption>
                        <IonSelectOption value="dióxido de azufre y sulfitos">Dióxido de azufre y sulfitos</IonSelectOption>
                        <IonSelectOption value="molusco">Molusco</IonSelectOption>
                        <IonSelectOption value="altramuces">Altramuces</IonSelectOption>
                        <IonSelectOption value="crustáceo">Crustáceo</IonSelectOption>
                        <IonSelectOption value="soja">Soja</IonSelectOption>
                        <IonSelectOption value="apio">Apio</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </IonList>
        </div>
    );
}