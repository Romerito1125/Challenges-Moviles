import {
    IonPage,
    IonContent,
    IonInput,
    IonItem,
    IonButton,
    IonAlert,

} from "@ionic/react";

import { useState, useContext } from "react";

import { useAccelerometer } from "../hooks/useAccelerometer";
const Accererometer: React.FC = () => {
    const {
        acceleration, magnitude,
        isShaking, isMoving
    } = useAccelerometer({ threshold: 18 });

    return (
        <>
            <p>X: {acceleration.x.toFixed(2)}</p>
            <p>Y: {acceleration.y.toFixed(2)}</p>
            <p>Z: {acceleration.z.toFixed(2)}</p>

            <p>Movimiento: {isMoving ? "Sí" : "No"}</p>
            <p>Magnitud: {magnitude.toFixed(2)}</p>

            {isShaking && <h1>SHAKE DETECTADO</h1>}
        </>
    )
};

export default Accererometer;
