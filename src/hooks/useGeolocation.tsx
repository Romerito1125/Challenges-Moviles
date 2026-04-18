import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";

export const useGeolocation = () => {

    const [position, setPosition] = useState<any>(null);
    const [watchId, setWatchId] = useState<string>("");
    const [error, setError] = useState<any>(null);

    // 🔥 pedir permisos SIEMPRE
    const requestPermission = async () => {
        try {
            const perm = await Geolocation.requestPermissions();
            return perm.location === "granted";
        } catch (err) {
            setError(err);
            return false;
        }
    };

    const getCurrentLocation = async () => {
        try {
            const granted = await requestPermission();
            if (!granted) return;

            const pos = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
            });

            setPosition(pos.coords);
        } catch (error) {
            console.log("ERROR GEO:", error);
            setError(error);
        }
    };

    const startTracking = async () => {
        try {
            const granted = await requestPermission();
            if (!granted) return;

            const id = await Geolocation.watchPosition(
                { enableHighAccuracy: true },
                (pos, err) => {
                    if (err) {
                        setError(err);
                        return;
                    }
                    if (pos) setPosition(pos.coords);
                }
            );

            setWatchId(id);
        } catch (err) {
            setError(err);
        }
    };

    const stopTracking = async () => {
        try {
            if (watchId) {
                await Geolocation.clearWatch({ id: watchId });
                setWatchId("");
            }
        } catch (err) {
            setError(err);
        }
    };

    return {
        position,
        error,
        getCurrentLocation,
        startTracking,
        stopTracking
    };
};
