import { useEffect, useState } from "react";
import {
  LocalNotifications,
} from "@capacitor/local-notifications";

export const useLocalNotifications = () => {
  const [permission, setPermission] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  const requestPermission = async () => {
    try {
      const result = await LocalNotifications.requestPermissions();
      setPermission(result.display);
      return result.display === "granted";
    } catch (err) {
      setError(err);
    }
  };

  const checkPermission = async () => {
    try {
      const result = await LocalNotifications.checkPermissions();
      setPermission(result.display);
    } catch (err) {
      setError(err);
    }
  };

  const sendNotification = async ({
    id = Date.now(),
    title = "Notificación",
    body = "Mensaje",
  }) => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body,
          },
        ],
      });
    } catch (err) {
      setError(err);
    }
  };

  const scheduleNotification = async ({
    id = Date.now(),
    title = "Recordatorio",
    body = "Tienes algo pendiente",
    seconds = 10,
  }) => {
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            id,
            title,
            body,
            schedule: {
              at: new Date(Date.now() + seconds * 1000),
            },
          },
        ],
      });
    } catch (err) {
      setError(err);
    }
  };

  const cancelNotification = async (id: any) => {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id }],
      });
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    let listener: any;

    const setupListener = async () => {
      listener = await LocalNotifications.addListener(
        "localNotificationActionPerformed",
        (notification) => {
          console.log("Notificación tocada:", notification);
        }
      );
    };

    setupListener();

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, []);

  useEffect(() => {
    checkPermission();
  }, []);

  return {
    permission,
    error,
    requestPermission,
    sendNotification,
    scheduleNotification,
    cancelNotification,
  };
};