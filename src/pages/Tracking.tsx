import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import { Network } from "@capacitor/network";

import { useGeolocation } from "../hooks/useGeolocation";
import useNetwork from "../hooks/useNetwork";
import { useHaptics } from "../hooks/useHaptics";
import { useDevice } from "../hooks/useDevice";
import { useLocalNotifications } from "../hooks/useLocalNotification";

type LatLng = [number, number];

const TrackingPage = () => {
    const { position, startTracking, stopTracking } = useGeolocation();
    const { isOnline } = useNetwork();
    const { impact } = useHaptics();
    const { battery } = useDevice();
    const { sendNotification, requestPermission } = useLocalNotifications();

    const [path, setPath] = useState<LatLng[]>([]);
    const [isTracking, setIsTracking] = useState(false);

    useEffect(() => {
        if (!position) return;

        const point: LatLng = [position.latitude, position.longitude];
        setPath((prev) => [...prev, point]);
    }, [position]);

    useEffect(() => {
        if (!battery) return;

        if (battery.batteryLevel < 0.2 && isTracking) {
            handleStopTracking();
            sendNotification({
                title: "Batería baja",
                body: "Tracking detenido por batería baja",
            });
        }
    }, [battery]);

    useEffect(() => {
        if (!isOnline) {
            sendNotification({
                title: "Sin conexión",
                body: "No hay internet disponible",
            });
        }
    }, [isOnline]);
    useEffect(() => {
        const interval = setInterval(async () => {
            const status = await Network.getStatus();

            if (!status.connected) {
                sendNotification({
                    title: "Sin conexión",
                    body: "No hay internet disponible",
                });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleStartTracking = async () => {
        await startTracking();
        setIsTracking(true);
        impact("medium");

        sendNotification({
            title: "Tracking iniciado",
            body: "Se está registrando tu recorrido",
        });
    };


    const handleStopTracking = async () => {
        console.log("STOP PRESSED");
        await stopTracking();
        setIsTracking(false);

        sendNotification({
            title: "Tracking detenido",
            body: "Se detuvo el seguimiento",
        });
    };


    return (
        <IonPage>
            <IonContent className="ion-padding">

                <h2>Tracking</h2>

                <p>Estado: {isTracking ? "Activo" : "Detenido"}</p>
                <p>Batería: {battery?.batteryLevel ? (battery.batteryLevel * 100).toFixed(0) + "%" : "..."}</p>
                <p>Internet: {isOnline ? "Online" : "Offline"}</p>

                <IonButton expand="block" onClick={handleStartTracking}>
                    Iniciar
                </IonButton>

                <IonButton expand="block" color="danger" onClick={handleStopTracking}>
                    Detener
                </IonButton>
                <p>{position ? "SI HAY POSICION" : "NO HAY POSICION"}</p>

                {position && (
                    <div style={{ height: "300px", width: "100%" }}>
                        <MapContainer
                            {...({
                                center: [position.latitude, position.longitude],
                                zoom: 18,
                            } as any)}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                            <Marker position={[position.latitude, position.longitude]} />
                        </MapContainer>
                    </div>
                )}


            </IonContent>
        </IonPage>
    );
};

export default TrackingPage;
