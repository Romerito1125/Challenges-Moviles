import { IonPage, IonContent, IonIcon, IonAlert } from "@ionic/react";
import { useEffect, useState, useRef } from "react";
import { exitOutline, enterOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useJornada } from "../context/JornadaContext";
import { useGeolocation } from "../hooks/useGeolocation";

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
  const { jornadaActiva, finalizarJornada } = useJornada();
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
    <IonPage style={{ "--background": "#020617", background: "#020617" }}>
      <IonContent fullscreen style={{ "--background": "#020617" }}>
        {/* Contenedor principal */}
        <div className="min-h-full bg-linear-to-br from-slate-900 via-slate-950 to-black text-white p-6 flex flex-col gap-6 pb-10">

          {/* Título */}
          <div>
            <h1 className="text-3xl font-bold m-0">Registro de Jornada</h1>
            <p className="text-gray-400 text-sm mt-1">
              Control de asistencia en tiempo real
            </p>
          </div>

          {/* Estado y reloj */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm m-0">Estado actual</p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full inline-block ${
                      jornadaActiva ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  <p
                    className={`font-semibold m-0 ${
                      jornadaActiva ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {jornadaActiva ? "Jornada en curso" : "Sin jornada activa"}
                  </p>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-2xl">
                📍
              </div>
            </div>

            <div className="border-t border-white/10 my-4" />

            <div>
              <p className="text-gray-400 text-sm m-0">Hora actual (Colombia)</p>
              <p className="text-3xl font-bold mt-1 mb-0">{time}</p>
              <p className="text-gray-400 text-sm m-0 capitalize">{date}</p>
            </div>
          </div>

          {/* Cronómetro — solo si hay jornada activa */}
          {jornadaActiva && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex flex-col items-center gap-1">
              <p className="text-green-400 text-sm font-medium m-0">
                Tiempo trabajado
              </p>
              <p className="text-4xl font-bold font-mono m-0">
                {formatCronometro(segundos)}
              </p>
              <p className="text-gray-400 text-xs m-0">
                Entrada: {horaEntradaFormateada}
              </p>
              {jornadaActiva.fotoDataUrl && (
                <img
                  src={jornadaActiva.fotoDataUrl}
                  alt="Foto de entrada"
                  className="mt-2 w-14 h-14 rounded-xl object-cover border border-white/10"
                />
              )}
            </div>
          )}

          {/* BOTÓN ENTRADA */}
          <button
            onClick={handleMarcarEntrada}
            disabled={!!jornadaActiva}
            className={`w-full flex items-center gap-4 px-6 py-4 border-none rounded-2xl transition-opacity shadow-[0_10px_25px_rgba(30,64,175,0.3)] ${
              jornadaActiva
                ? "bg-blue-500/30 opacity-50 cursor-not-allowed"
                : "bg-linear-to-r from-blue-600 to-blue-500 cursor-pointer"
            }`}
          >
            <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
              <IonIcon icon={enterOutline} className="text-white text-xl" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-lg m-0">
                Marcar Entrada
              </p>
              <p className="text-blue-200 text-sm m-0">
                {jornadaActiva
                  ? "Ya tienes una jornada activa"
                  : "Registrar inicio de jornada"}
              </p>
            </div>
          </button>

          {/* BOTÓN SALIDA */}
          <button
            onClick={handleMarcarSalida}
            disabled={!jornadaActiva}
            className={`w-full flex items-center gap-4 px-6 py-4 border-none rounded-2xl transition-opacity shadow-[0_10px_25px_rgba(153,27,27,0.3)] ${
              !jornadaActiva
                ? "bg-red-600/30 opacity-50 cursor-not-allowed"
                : "bg-linear-to-r from-red-600 to-red-500 cursor-pointer"
            }`}
          >
            <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
              <IonIcon icon={exitOutline} className="text-white text-xl" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-lg m-0">
                Marcar Salida
              </p>
              <p className="text-red-200 text-sm m-0">
                {jornadaActiva
                  ? "Registrar fin de jornada"
                  : "No hay jornada activa"}
              </p>
            </div>
          </button>

          {/* Resumen rápido */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm m-0">Jornada de hoy</p>
              <p className="text-sm mt-1 mb-0">
                {jornadaActiva
                  ? `Entrada a las ${horaEntradaFormateada}`
                  : "Aún no has marcado entrada"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm m-0">Tiempo</p>
              <p className="text-xl font-bold font-mono m-0">
                {jornadaActiva ? formatCronometro(segundos) : "00:00:00"}
              </p>
            </div>
          </div>

          {/* Navegación rápida */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "📋 Historial", path: "/employee-history" },
              { label: "👤 Perfil", path: "/profile" },
              { label: "🛠 Admin", path: "/admin-dashboard" },
              { label: "👥 Empleados", path: "/employees" },
            ].map(({ label, path }) => (
              <button
                key={path}
                onClick={() => history.push(path)}
                className="bg-white/5 border border-white/10 rounded-xl py-3 px-2 text-gray-300 text-sm cursor-pointer"
              >
                {label}
              </button>
            ))}
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
