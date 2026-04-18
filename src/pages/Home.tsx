import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton
} from "@ionic/react";
import { getDistance } from "../utils/calcularDistancia";
import { useEffect, useRef } from "react";
import { useMissions } from "../context/MisionesContext";
import MissionList from "../components/MisionList";
import ProgressBar from "../components/Progreso";
import { useCamera } from "../hooks/useCamera";
import { useGeolocation } from "../hooks/useGeolocation";
import { useAccelerometer } from "../hooks/useAccelerometer";
import { useHaptics } from "../hooks/useHaptics";
import { useLocalNotifications } from "../hooks/useLocalNotification";
import Ranking from "../components/Raking";

const Home = () => {

  const { misiones, puntos, completarMision } = useMissions();

  const { photo, takePhoto } = useCamera();
  const { position, startTracking } = useGeolocation();
  const { isMoving } = useAccelerometer();
  const { vibrate } = useHaptics();
  const { sendNotification, requestPermission } = useLocalNotifications();
  const startPos = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    console.log("FOTO:", photo);

    if (photo) {
      console.log("COMPLETANDO MISIÓN 1");
      completarMision(1);

      sendNotification({
        title: "Misión completada",
        body: "Foto tomada"
      });
    }
  }, [photo]);

  useEffect(() => {
    if (!position) return;

    if (!startPos.current) {
      startPos.current = position;
      return;
    }

    const dist = getDistance(
      startPos.current.latitude,
      startPos.current.longitude,
      position.latitude,
      position.longitude
    );

    if (dist > 30) {
      completarMision(2);
      sendNotification({ title: "Misión completada", body: "Te moviste" });
    }
  }, [position]);

  useEffect(() => {
    if (!misiones[1]?.completado) return;

    if (!isMoving) {
      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          vibrate();
          completarMision(3);
        }, 10000);
      }
    } else {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [isMoving, misiones]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Misiones</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <h2>Puntos: {puntos}</h2>

        <ProgressBar misiones={misiones} />

        <MissionList misiones={misiones} />

        <IonButton expand="block" onClick={takePhoto}>
          Tomar Foto
        </IonButton>

        <IonButton expand="block" onClick={startTracking}>
          Iniciar GPS
        </IonButton>
        {/* DEBUG GEO */}
        <div style={{ marginTop: 20 }}>
          <h3>Ubicación actual:</h3>

          {!position && <p>⏳ Esperando ubicación...</p>}

          {position && (
            <>
              <p>Lat: {position.latitude}</p>
              <p>Lng: {position.longitude}</p>
              <p>Precisión: {position.accuracy}</p>
            </>
          )}
        </div>

        <Ranking />

      </IonContent>
    </IonPage>
  );
};

export default Home;

