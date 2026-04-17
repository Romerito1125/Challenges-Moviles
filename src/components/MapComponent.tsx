import { IonButton } from "@ionic/react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { useGeolocation } from "../hooks/useGeolocation";
import { getAddress } from "../services/opencagedata";
import './MapComponent.css';

const RecenterMap = ({ position }: { position: any }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([position?.latitude ?? 0, position?.longitude ?? 0]);
    }, [position]);
    return null;
};

const MapView = () => {
    const { position: currentPosition, getCurrentLocation, startTracking, stopTracking } = useGeolocation();
    const [path, setPath] = useState<any[]>([]);
    const [ready, setReady] = useState(false);
    const [address, setAddress] = useState<any | null>(null);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    useEffect(() => {
        if (currentPosition) {
            setReady(true);
            setPath((prev) => [...prev, [currentPosition.latitude, currentPosition.longitude]]);
        }
    }, [currentPosition]);

    const handleGetAddress = async () => {
        if (!currentPosition) return;
        const address = await getAddress(currentPosition.latitude, currentPosition.longitude);
        console.log(address);
        setAddress(address);
    };

    return (
        <>
            <IonButton onClick={() => startTracking()}>Iniciar</IonButton>
            <IonButton onClick={() => stopTracking()}>Detener</IonButton>
            <IonButton onClick={() => getCurrentLocation()}>Obtener ubicación</IonButton>
            <IonButton onClick={() => handleGetAddress()}>Obtener dirección</IonButton>
            <p>{address?.results[0]?.formatted}</p>

            {ready ? (
                <MapContainer
                    center={[currentPosition.latitude, currentPosition.longitude]}
                    zoom={18}
                    className="map-container"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <RecenterMap position={currentPosition} />
                    <Marker position={[currentPosition.latitude, currentPosition.longitude]} />
                    <Polyline positions={path} />
                </MapContainer>
            ) : (
                <div className="map-container"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <p>Obteniendo ubicación...</p>
                </div>
            )}
        </>
    );
};

export default MapView;