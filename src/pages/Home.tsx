import { IonPage, IonContent, IonIcon, IonAlert } from "@ionic/react";
import { useEffect, useState, useRef } from "react";
import { exitOutline, enterOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useJornadaLocal } from "../hooks/useJornadaLocal";
import { useGeolocation } from "../hooks/useGeolocation";

/** Formatea segundos a HH:MM:SS */
function formatCronometro(segundos: number): string {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = segundos % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function EmployeeHome() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [segundos, setSegundos] = useState(0);
  const [showConfirmSalida, setShowConfirmSalida] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const history = useHistory();
  const { jornadaActiva, finalizarJornada } = useJornadaLocal();
  const { getCurrentLocation, position } = useGeolocation();

  // Reloj en tiempo real
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat("es-CO", {
          timeZone: "America/Bogota",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(now)
      );
      setDate(
        new Intl.DateTimeFormat("es-CO", {
          timeZone: "America/Bogota",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(now)
      );
    };
    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  // Cronómetro de jornada activa
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (jornadaActiva) {
      const calcular = () => {
        const diff = Math.floor(
          (Date.now() - new Date(jornadaActiva.horaEntrada).getTime()) / 1000
        );
        setSegundos(diff);
      };
      calcular();
      intervalRef.current = setInterval(calcular, 1000);
    } else {
      setSegundos(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [jornadaActiva]);

  const handleMarcarEntrada = () => {
    history.push("/camera-capture");
  };

  const handleMarcarSalida = () => {
    setShowConfirmSalida(true);
  };

  const confirmarSalida = async () => {
    // Intentar obtener ubicación de salida (no bloqueante)
    await getCurrentLocation().catch(() => {});

    const coords = position
      ? { lat: position.latitude, lng: position.longitude }
      : null;

    const registro = await finalizarJornada(coords);

    if (registro) {
      history.push("/jornada-resumen", { jornada: registro });
    }
  };

  const horaEntradaFormateada = jornadaActiva
    ? new Date(jornadaActiva.horaEntrada).toLocaleTimeString("es-CO", {
        timeZone: "America/Bogota",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <IonPage>
      <IonContent>
        <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#020617] to-black text-white p-6 flex flex-col gap-6">

          {/* Título */}
          <div>
            <h1 className="text-3xl font-bold">Registro de Jornada</h1>
            <p className="text-gray-400 text-sm mt-1">
              Control de asistencia en tiempo real
            </p>
          </div>

          {/* Estado y reloj */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Estado actual</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      jornadaActiva ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  <p
                    className={`font-semibold ${
                      jornadaActiva ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {jornadaActiva ? "Jornada en curso" : "Sin jornada activa"}
                  </p>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                📍
              </div>
            </div>

            <div className="border-t border-white/10 my-4" />

            <div>
              <p className="text-gray-400 text-sm">Hora actual (Colombia)</p>
              <p className="text-3xl font-bold mt-1">{time}</p>
              <p className="text-gray-400 text-sm capitalize">{date}</p>
            </div>
          </div>

          {/* Cronómetro — solo visible si hay jornada activa */}
          {jornadaActiva && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex flex-col items-center gap-1">
              <p className="text-green-400 text-sm font-medium">
                Tiempo trabajado
              </p>
              <p className="text-4xl font-bold text-white font-mono">
                {formatCronometro(segundos)}
              </p>
              <p className="text-gray-400 text-xs">
                Entrada: {horaEntradaFormateada}
              </p>
              {jornadaActiva.fotoEntrada && (
                <img
                  src={jornadaActiva.fotoEntrada}
                  alt="Foto de entrada"
                  className="mt-2 w-14 h-14 rounded-xl object-cover border border-white/10"
                />
              )}
            </div>
          )}

          {/* BOTÓN ENTRADA */}
          <div className="px-4">
            <div className="rounded-2xl overflow-hidden">
              <button
                onClick={handleMarcarEntrada}
                disabled={!!jornadaActiva}
                className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-900/30 active:scale-95 hover:scale-[1.02] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
                    <IonIcon icon={enterOutline} className="text-white text-xl" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">
                      Marcar Entrada
                    </p>
                    <p className="text-blue-100 text-sm">
                      {jornadaActiva
                        ? "Ya tienes una jornada activa"
                        : "Registrar inicio de jornada"}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* BOTÓN SALIDA */}
          <div className="px-4">
            <div className="rounded-2xl overflow-hidden">
              <button
                onClick={handleMarcarSalida}
                disabled={!jornadaActiva}
                className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/30 active:scale-95 hover:scale-[1.02] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
                    <IonIcon icon={exitOutline} className="text-white text-xl" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">
                      Marcar Salida
                    </p>
                    <p className="text-red-100 text-sm">
                      {jornadaActiva
                        ? "Registrar fin de jornada"
                        : "No hay jornada activa"}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Resumen rápido */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Jornada de hoy</p>
              <p className="text-sm">
                {jornadaActiva
                  ? `Entrada a las ${horaEntradaFormateada}`
                  : "Aún no has marcado entrada"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Tiempo</p>
              <p className="text-xl font-bold font-mono">
                {jornadaActiva ? formatCronometro(segundos) : "00:00:00"}
              </p>
            </div>
          </div>

          {/* Navegación rápida */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={() => history.push("/employee-history")}
              className="bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-gray-300 hover:bg-white/10 transition-all"
            >
              📋 Historial
            </button>
            <button
              onClick={() => history.push("/profile")}
              className="bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-gray-300 hover:bg-white/10 transition-all"
            >
              👤 Perfil
            </button>
            <button
              onClick={() => history.push("/admin-dashboard")}
              className="bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-gray-300 hover:bg-white/10 transition-all"
            >
              🛠 Admin
            </button>
            <button
              onClick={() => history.push("/employees")}
              className="bg-white/5 border border-white/10 rounded-xl py-3 text-sm text-gray-300 hover:bg-white/10 transition-all"
            >
              👥 Empleados
            </button>
          </div>
        </div>

        {/* Confirmación de salida */}
        <IonAlert
          isOpen={showConfirmSalida}
          header="¿Finalizar jornada?"
          message="Se registrará tu hora de salida y podrás ver el resumen de tu jornada."
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => setShowConfirmSalida(false),
            },
            {
              text: "Finalizar",
              handler: () => {
                setShowConfirmSalida(false);
                confirmarSalida();
              },
            },
          ]}
          onDidDismiss={() => setShowConfirmSalida(false)}
        />
      </IonContent>
    </IonPage>
  );
}
