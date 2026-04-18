import { useState } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";

export const useCamera = () => {
    const [photo, setPhoto] = useState<any>(null);

    const takePhoto = async () => {
        const image = await Camera.getPhoto({
            quality: 90,
            resultType: CameraResultType.Uri,
        })

        setPhoto(image.webPath);

    };

    return {
        photo,
        takePhoto
    }

}