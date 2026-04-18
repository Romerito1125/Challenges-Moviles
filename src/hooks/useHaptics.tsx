import { useState, useEffect } from "react";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

export const useHaptics = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  const checkAvailability = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
      setIsAvailable(true);
    } catch (err) {
      setIsAvailable(false);
    }
  };

  useEffect(() => {
    checkAvailability();
  }, []);

  const impact = async (style: any = "medium") => {
    if (!isAvailable) return;

    const map: any = {
      light: ImpactStyle.Light,
      medium: ImpactStyle.Medium,
      heavy: ImpactStyle.Heavy,
    };

    await Haptics.impact({
      style: map[style] || ImpactStyle.Medium,
    });
  };

  const notify = async (type: any = "success") => {
    if (!isAvailable) return;

    const map: any = {
      success: NotificationType.Success,
      warning: NotificationType.Warning,
      error: NotificationType.Error,
    };

    await Haptics.notification({
      type: map[type] || NotificationType.Success,
    });
  };

  const vibrate = async (duration = 1000) => {
    if (!isAvailable) return;
    await Haptics.vibrate({ duration });
  };

  const selectionStart = async () => {
    if (!isAvailable) return;
    await Haptics.selectionStart();
  };

  const selectionChanged = async () => {
    if (!isAvailable) return;
    await Haptics.selectionChanged();
  };

  const selectionEnd = async () => {
    if (!isAvailable) return;
    await Haptics.selectionEnd();
  };

  return {
    isAvailable,
    impact,
    notify,
    vibrate,
    selectionStart,
    selectionChanged,
    selectionEnd,
  };
};
