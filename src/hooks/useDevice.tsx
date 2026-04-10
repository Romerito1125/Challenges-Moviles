import { useEffect, useState } from "react";
import { Device } from "@capacitor/device";

export const useDevice = () => {
  const [battery, setBattery] = useState<any>(null);
  const [info, setInfo] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const loadDeviceData = async () => {
    try {
      setLoading(true);

      const batteryInfo = await Device.getBatteryInfo();
      const deviceInfo = await Device.getInfo();
      const id = await Device.getId();

      setBattery(batteryInfo);
      setInfo(deviceInfo);
      setDeviceId(id.identifier);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeviceData();
  }, []);

  return {
    battery,
    info,
    deviceId,
    loading,
    error,
    refresh: loadDeviceData,
  };
};