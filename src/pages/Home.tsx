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
    <IonPage style={{ '--background': '#020617', background: '#020617' }}>
      <IonContent fullscreen style={{ "--background": "#020617" }}>
        <div
          style={{
            minHeight: "100%",
            background: "linear-gradient(to bottom right, #0f172a, #020617, #000000)",
            color: "white",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            paddingBottom: "40px",
          }}
        >
          {/* Título */}
          <div>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 700, margin: 0 }}>
              Registro de Jornada
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "0.875rem", marginTop: 4 }}>
              Control de asistencia en tiempo real
            </p>
          </div>

          {/* Estado y reloj */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#9ca3af", fontSize: "0.875rem", margin: 0 }}>Estado actual</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: jornadaActiva ? "#22c55e" : "#6b7280",
                      display: "inline-block",
                    }}
                  />
                  <p
                    style={{
                      fontWeight: 600,
                      margin: 0,
                      color: jornadaActiva ? "#4ade80" : "#9ca3af",
                    }}
                  >
                    {jornadaActiva ? "Jornada en curso" : "Sin jornada activa"}
                  </p>
                </div>
              </div>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                📍
              </div>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
                margin: "16px 0",
              }}
            />

            <div>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", margin: 0 }}>
                Hora actual (Colombia)
              </p>
              <p style={{ fontSize: "1.875rem", fontWeight: 700, margin: "4px 0 0" }}>{time}</p>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", margin: 0, textTransform: "capitalize" }}>
                {date}
              </p>
            </div>
          </div>

          {/* Cronómetro — solo si hay jornada activa */}
          {jornadaActiva && (
            <div
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 16,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <p style={{ color: "#4ade80", fontSize: "0.875rem", fontWeight: 500, margin: 0 }}>
                Tiempo trabajado
              </p>
              <p
                style={{
                  fontSize: "2.25rem",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  margin: 0,
                }}
              >
                {formatCronometro(segundos)}
              </p>
              <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: 0 }}>
                Entrada: {horaEntradaFormateada}
              </p>
              {jornadaActiva.fotoDataUrl && (
                <img
                  src={jornadaActiva.fotoDataUrl}
                  alt="Foto de entrada"
                  style={{
                    marginTop: 8,
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    objectFit: "cover",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              )}
            </div>
          )}

          {/* BOTÓN ENTRADA */}
          <button
            onClick={handleMarcarEntrada}
            disabled={!!jornadaActiva}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 24px",
              background: jornadaActiva
                ? "rgba(59,130,246,0.3)"
                : "linear-gradient(to right, #2563eb, #3b82f6)",
              border: "none",
              borderRadius: 16,
              cursor: jornadaActiva ? "not-allowed" : "pointer",
              opacity: jornadaActiva ? 0.5 : 1,
              boxShadow: "0 10px 25px rgba(30,64,175,0.3)",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: 12,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IonIcon icon={enterOutline} style={{ color: "white", fontSize: "1.25rem" }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ color: "white", fontWeight: 600, fontSize: "1.125rem", margin: 0 }}>
                Marcar Entrada
              </p>
              <p style={{ color: "#bfdbfe", fontSize: "0.875rem", margin: 0 }}>
                {jornadaActiva ? "Ya tienes una jornada activa" : "Registrar inicio de jornada"}
              </p>
            </div>
          </button>

          {/* BOTÓN SALIDA */}
          <button
            onClick={handleMarcarSalida}
            disabled={!jornadaActiva}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "16px 24px",
              background: !jornadaActiva
                ? "rgba(220,38,38,0.3)"
                : "linear-gradient(to right, #dc2626, #ef4444)",
              border: "none",
              borderRadius: 16,
              cursor: !jornadaActiva ? "not-allowed" : "pointer",
              opacity: !jornadaActiva ? 0.5 : 1,
              boxShadow: "0 10px 25px rgba(153,27,27,0.3)",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: 12,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IonIcon icon={exitOutline} style={{ color: "white", fontSize: "1.25rem" }} />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ color: "white", fontWeight: 600, fontSize: "1.125rem", margin: 0 }}>
                Marcar Salida
              </p>
              <p style={{ color: "#fecaca", fontSize: "0.875rem", margin: 0 }}>
                {jornadaActiva ? "Registrar fin de jornada" : "No hay jornada activa"}
              </p>
            </div>
          </button>

          {/* Resumen rápido */}
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", margin: 0 }}>Jornada de hoy</p>
              <p style={{ fontSize: "0.875rem", margin: "4px 0 0" }}>
                {jornadaActiva
                  ? `Entrada a las ${horaEntradaFormateada}`
                  : "Aún no has marcado entrada"}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#9ca3af", fontSize: "0.875rem", margin: 0 }}>Tiempo</p>
              <p style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "monospace", margin: 0 }}>
                {jornadaActiva ? formatCronometro(segundos) : "00:00:00"}
              </p>
            </div>
          </div>

          {/* Navegación rápida */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {[
              { label: "📋 Historial", path: "/employee-history" },
              { label: "👤 Perfil", path: "/profile" },
              { label: "🛠 Admin", path: "/admin-dashboard" },
              { label: "👥 Empleados", path: "/employees" },
            ].map(({ label, path }) => (
              <button
                key={path}
                onClick={() => history.push(path)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "12px 8px",
                  color: "#d1d5db",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
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
