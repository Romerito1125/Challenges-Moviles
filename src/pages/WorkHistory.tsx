/**
 * WorkHistory / Historial de jornadas
 * ------------------------------------
 * Muestra todas las jornadas guardadas en localStorage.
 * TODO-BACKEND: reemplazar useJornadaLocal por useJornadas (del jornadaService)
 * cuando el backend esté disponible.
 */

import { IonPage, IonContent, IonIcon } from "@ionic/react";
import {
  timeOutline,
  calendarOutline,
  locationOutline,
  cameraOutline,
  cloudUploadOutline,
  checkmarkCircleOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useJornada } from "../context/JornadaContext";
import { JornadaRegistro } from "../hooks/useJornadaLocal";
import MapaUbicacion from "../components/MapaUbicacion";

function formatDuracion(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function JornadaCard({ jornada }: { jornada: JornadaRegistro }) {
  const [expandida, setExpandida] = useState(false);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Cabecera siempre visible */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setExpandida((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <IonIcon icon={calendarOutline} className="text-blue-400 text-lg" />
          </div>
          <div>
            <p className="text-white font-semibold">{jornada.fecha}</p>
            <p className="text-gray-400 text-xs">
              {jornada.horaEntrada} → {jornada.horaSalida}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-white font-bold">{formatDuracion(jornada.duracionMinutos)}</p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              jornada.sincronizado
                ? "bg-green-500/20 text-green-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {jornada.sincronizado ? "Sincronizado" : "Local"}
          </span>
        </div>
      </button>

      {/* Detalle expandible */}
      {expandida && (
        <div className="border-t border-white/10 px-5 py-4 flex flex-col gap-3">

          {/* Horas trabajadas */}
          <div className="flex items-center gap-3">
            <IonIcon icon={timeOutline} className="text-purple-400 text-lg" />
            <div>
              <p className="text-gray-400 text-xs">Horas trabajadas</p>
              <p className="text-white text-sm font-medium">
                {jornada.horasTrabajadas.toFixed(2)} h
              </p>
            </div>
          </div>

          {/* Ubicación entrada */}
          <div className="flex items-start gap-3">
            <IonIcon icon={locationOutline} className="text-teal-400 text-lg mt-1" />
            <div style={{ flex: 1 }}>
              <p className="text-gray-400 text-xs">Ubicación de entrada</p>
              {jornada.coordenadasEntrada ? (
                <div style={{ marginTop: 8 }}>
                  <MapaUbicacion
                    lat={jornada.coordenadasEntrada.lat}
                    lng={jornada.coordenadasEntrada.lng}
                    label="Entrada"
                    height={160}
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No disponible</p>
              )}
            </div>
          </div>

          {/* Foto entrada */}
          <div className="flex items-start gap-3">
            <IonIcon icon={cameraOutline} className="text-orange-400 text-lg mt-0.5" />
            <div>
              <p className="text-gray-400 text-xs">Foto de entrada</p>
              {jornada.fotoDataUrl ? (
                <img
                  src={jornada.fotoDataUrl}
                  alt="Foto de entrada"
                  className="mt-2 w-20 h-20 rounded-xl object-cover border border-white/10"
                />
              ) : (
                <p className="text-gray-500 text-sm">No disponible</p>
              )}
            </div>
          </div>

          {/* Estado sincronización */}
          <div className="flex items-center gap-3">
            <IonIcon
              icon={jornada.sincronizado ? checkmarkCircleOutline : cloudUploadOutline}
              className={`text-lg ${jornada.sincronizado ? "text-green-400" : "text-yellow-400"}`}
            />
            <div>
              <p className="text-gray-400 text-xs">Sincronización</p>
              <p className={`text-sm font-medium ${jornada.sincronizado ? "text-green-400" : "text-yellow-400"}`}>
                {jornada.sincronizado
                  ? "Guardado en el servidor"
                  : "Pendiente de sincronizar"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployeeHistory() {
  const history = useHistory();
  const { historial } = useJornada();

  // Estadísticas rápidas
  const totalHoras = historial.reduce((acc, j) => acc + j.horasTrabajadas, 0);
  const totalJornadas = historial.length;
  const pendientesSincronizar = historial.filter((j) => !j.sincronizado).length;

  return (
    <IonPage>
      <IonContent style={{ '--background': '#020617' }}>
        <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#020617] to-black text-white px-6 py-10 flex flex-col gap-6">

          {/* Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => history.goBack()}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <IonIcon icon={arrowBackOutline} className="text-white text-xl" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Historial de jornadas</h1>
              <p className="text-gray-400 text-sm">Registros guardados localmente</p>
            </div>
          </div>

          {/* Resumen estadístico */}
          {totalJornadas > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-white">{totalJornadas}</p>
                <p className="text-gray-400 text-xs text-center">Jornadas</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-1">
                <p className="text-2xl font-bold text-white">{totalHoras.toFixed(1)}h</p>
                <p className="text-gray-400 text-xs text-center">Total horas</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-1">
                <p className={`text-2xl font-bold ${pendientesSincronizar > 0 ? "text-yellow-400" : "text-green-400"}`}>
                  {pendientesSincronizar}
                </p>
                <p className="text-gray-400 text-xs text-center">Pendientes</p>
              </div>
            </div>
          )}

          {/* Lista de jornadas */}
          {historial.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <IonIcon icon={calendarOutline} className="text-gray-500 text-4xl" />
              </div>
              <p className="text-gray-400 text-center">
                No hay jornadas registradas aún.
                <br />
                <span className="text-sm">Marca tu primera entrada desde el inicio.</span>
              </p>
              <button
                onClick={() => history.push("/home")}
                className="px-6 py-3 bg-blue-600 rounded-xl text-white font-medium text-sm"
              >
                Ir al inicio
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {historial.map((jornada) => (
                <JornadaCard key={jornada.id} jornada={jornada} />
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
