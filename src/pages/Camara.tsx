import {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    IonButton,
    IonAlert,

} from "@ionic/react";

import { useState, useContext } from "react";

import { useCamera } from "../hooks/useCamera";

const Camara: React.FC = () => {
    const { photo, takePhoto } = useCamera();

    return (
        <>
            <IonButton onClick={takePhoto}>Tomar Foto</IonButton>

            {photo && <img src={photo} />}
        </>
    )
};

export default Camara;
