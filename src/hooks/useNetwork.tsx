import { useState, useEffect, use } from "react"

import { Network } from "@capacitor/network"

const useNetwork = () => {

    const [isOnline, setIsOnline] = useState(true);
    const [connectionType, setConnectionType] = useState<String>("none");


    useEffect(() => {

        const checkInitialStatus = async () => {
            const status = await Network.getStatus();
            setIsOnline(status.connected)
            setConnectionType(status.connectionType);
        };

        checkInitialStatus();


        const listener = Network.addListener("networkStatusChange", (status) => {
            setIsOnline(status.connected);
            setConnectionType(status.connectionType)
        });

        return () => {
            listener.then((q) => q.remove());
        };
    }, []);
return {isOnline, connectionType}

};

export default useNetwork;