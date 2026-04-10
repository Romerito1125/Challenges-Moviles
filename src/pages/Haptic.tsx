import {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    IonButton,
    IonAlert,

} from "@ionic/react";

import { useState, useContext } from "react";

import { useHaptics } from "../hooks/useHaptics";
const Haptic: React.FC = () => {

    const { impact, notify, vibrate } = useHaptics();

    return (
        <>
            <IonButton onClick={() => impact("light")}>
                Impacto suave
            </IonButton>

            <IonButton onClick={() => impact("heavy")}>
                Impacto fuerte
            </IonButton>

            <IonButton onClick={() => notify("success")}>
                Éxito
            </IonButton>

            <IonButton onClick={() => notify("error")}>
                Error
            </IonButton>

            <IonButton onClick={() => vibrate(200)}>
                Vibrar
            </IonButton>
        </>
    )
};

export default Haptic;
