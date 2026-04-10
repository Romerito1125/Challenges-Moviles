import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonAlert
} from "@ionic/react";

import { useState, useContext } from "react";
import { usePushNotifications } from "../hooks/usePushNotifications";

const PushNotification: React.FC = () => {

  const { requestPermission, token, notification } = usePushNotifications();

  return (
    <>
      <IonButton onClick={requestPermission}>
        Activar Push
      </IonButton>

      <p>Token: {token}</p>

      {notification && (
        <p>{notification.title} - {notification.body}</p>
      )}
    </>
  )
};

export default PushNotification;
