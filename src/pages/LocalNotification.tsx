import {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    IonButton,
    IonAlert
} from "@ionic/react";

import { useState, useContext } from "react";
import { useLocalNotifications } from "../hooks/useLocalNotification";

const LocalNotification: React.FC = () => {

    const {
        requestPermission, sendNotification,
        scheduleNotification } = useLocalNotifications();

    return (
        <>
            <IonButton onClick={requestPermission}>
                Permisos
            </IonButton>

            <IonButton
                onClick={() =>
                    sendNotification({
                        title: "Hola tu",
                        body: "Hola, noti local",
                    })
                }
            >
                Enviar ahora
            </IonButton>

            <IonButton
                onClick={() =>
                    scheduleNotification({
                        title: "Recordatorio",
                        body: "En 5 segundos",
                        seconds: 5,
                    })
                }
            >
                Programar
            </IonButton>
        </>
    )
};

export default LocalNotification;
