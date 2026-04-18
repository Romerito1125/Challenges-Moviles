import { useEffect, useState, useRef } from "react";
import { Motion } from "@capacitor/motion";

export const useAccelerometer = ({
    threshold = 20, interval = 100, shakeDelay = 1000,
} = {}) => {
    const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
    const [magnitude, setMagnitude] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const [isMoving, setIsMoving] = useState(false);

    const lastUpdate = useRef<any>(0);
    const lastShake = useRef<any>(0);
    const listenerRef = useRef<any>(null);

    const start = async () => {
        listenerRef.current = await Motion.addListener("accel", (event) => {
            const now = Date.now();

            if (now - lastUpdate.current < interval) return;
            lastUpdate.current = now;

            const acc = event.acceleration;

            const x = acc.x || 0;
            const y = acc.y || 0;
            const z = acc.z || 0;

            setAcceleration({ x, y, z });

            const total = Math.abs(x) + Math.abs(y) + Math.abs(z);
            setMagnitude(total);

            setIsMoving(total > 2);

            if (total > threshold && now - lastShake.current > shakeDelay) {
                setIsShaking(true);
                lastShake.current = now;

                setTimeout(() => setIsShaking(false), 500);
            }
        });
    };

    const stop = async () => {
        if (listenerRef.current) {
            await listenerRef.current.remove();
            listenerRef.current = null;
        }
    };

    useEffect(() => {
        start();

        return () => {
            stop();
        };
    }, []);


    return {
        acceleration,
        magnitude,
        isShaking,
        isMoving,
        start,
        stop,
    };
}