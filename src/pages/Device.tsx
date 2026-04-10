import {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    IonButton,
    IonAlert,

} from "@ionic/react";

import { useState, useContext } from "react";

import { useDevice } from "../hooks/useDevice";
const Device: React.FC = () => {
    const { battery, info, deviceId, loading } = useDevice();

    if (loading) return <p>Cargando...</p>;

    return (
        <>
            <p>Batería: {battery?.batteryLevel * 100}%</p>
            <p>{battery?.isCharging ? "Cargando" : "No cargando"}</p>

            <p>Modelo: {info?.model}</p>
            <p>Plataforma: {info?.platform}</p>
            <p>OS: {info?.operatingSystem}</p>

            <p>ID: {deviceId}</p>
        </>
    )
};

export default Device;
