import React, { useState } from 'react';
import { IonAlert, IonButton } from '@ionic/react';

let show = () => {};
export function TriggerAlert(msg) {
  show(msg);
}

export default function Alert() {
  const [isOpen, setIsOpen] = useState(false);
  const [txt, setTxt] = useState("");

  show = (msg) => {
    setIsOpen(true);
    setTxt(msg);
  };
  console.log(isOpen);

  return (
    <>
      <IonAlert
        isOpen={isOpen}
        header="ERROR"
        message={txt}
        buttons={['OK']}
        cssClass="alertStyle"
        onDidDismiss={() => setIsOpen(false)}
      ></IonAlert>
    </>
  );
}