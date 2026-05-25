import { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export const useCamera = () => {
    const [photo, setPhoto] = useState<string | null>(null);

    const takePhoto = async () => {
        const image = await Camera.getPhoto({
            quality: 80,
            resultType: CameraResultType.DataUrl, // base64 data URL → persistible en localStorage
            source: CameraSource.Camera,
            correctOrientation: true,
        });

        // image.dataUrl es "data:image/jpeg;base64,..." → funciona en <img src> y en localStorage
        if (image.dataUrl) {
            setPhoto(image.dataUrl);
        }
    };

    return {
        photo,
        takePhoto,
    };
};