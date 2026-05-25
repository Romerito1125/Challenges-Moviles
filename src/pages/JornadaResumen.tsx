/**
 * JornadaResumen
 * --------------
 * Pantalla que se muestra al finalizar una jornada.
 * Recibe el registro de la jornada via location.state y muestra el resumen.
 * Desde aquí el empleado puede volver al home.
 *
 * TODO-BACKEND: mostrar si la jornada fue sincronizada con el servidor.
 */

import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  checkmarkCircleOutline,
  timeOutline,
  calendarOutline,
  locationOutline,
  cameraOutline,
  homeOutline,
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { JornadaRegistro } from '../hooks/useJornadaLocal';

interface LocationState {
  jornada: JornadaRegistro;
}

function formatDuracion(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export default function JornadaResumen() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const jornada = location.state?.jornada;

  // Si no hay datos (acceso directo a la URL), redirigir al home
  if (!jornada) {
    history.replace('/home');
    return null;
  }

  const horasTrabajadas = jornada.horasTrabajadas;
  const esJornadaCompleta = horasTrabajadas >= 8;

  return (
    <IonPage>
      <IonContent>
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white flex flex-col px-6 py-10 gap-6">

          {/* Encabezado */}
          <div className="flex flex-col items-center gap-3 pt-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${esJornadaCompleta ? 'bg-green-500/20 border border-green-500/40' : 'bg-yellow-500/20 border border-yellow-500/40'}`}>
              <IonIcon
                icon={checkmarkCircleOutline}
                className={`text-5xl ${esJornadaCompleta ? 'text-green-400' : 'text-yellow-400'}`}
              />
            </div>
            <h1 className="text-2xl font-bold text-center">¡Jornada finalizada!</h1>
            <p className="text-gray-400 text-sm text-center">
              Aquí está el resumen de tu jornada de hoy
            </p>
          </div>

          {/* Tarjeta principal — duración */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-2">
            <p className="text-gray-400 text-sm">Tiempo trabajado</p>
            <p className="text-5xl font-bold text-white">{formatDuracion(jornada.duracionMinutos)}</p>
            <p className={`text-sm font-medium mt-1 ${esJornadaCompleta ? 'text-green-400' : 'text-yellow-400'}`}>
              {esJornadaCompleta ? '✓ Jornada completa' : '⚠ Jornada incompleta'}
            </p>
          </div>

          {/* Detalles */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

            {/* Fecha */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <IonIcon icon={calendarOutline} className="text-blue-400 text-lg" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Fecha</p>
                <p className="text-white font-medium">{jornada.fecha}</p>
              </div>
            </div>

            {/* Hora entrada */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
                <IonIcon icon={timeOutline} className="text-green-400 text-lg" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Hora de entrada</p>
                <p className="text-white font-medium">{jornada.horaEntrada}</p>
              </div>
            </div>

            {/* Hora salida */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center">
                <IonIcon icon={timeOutline} className="text-red-400 text-lg" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Hora de salida</p>
                <p className="text-white font-medium">{jornada.horaSalida}</p>
              </div>
            </div>

            {/* Horas trabajadas */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <IonIcon icon={timeOutline} className="text-purple-400 text-lg" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Horas trabajadas</p>
                <p className="text-white font-medium">{jornada.horasTrabajadas.toFixed(2)} h</p>
              </div>
            </div>

            {/* Ubicación entrada */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center">
                <IonIcon icon={locationOutline} className="text-teal-400 text-lg" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Ubicación de entrada</p>
                {jornada.coordenadasEntrada ? (
                  <p className="text-white font-medium text-sm">
                    {jornada.coordenadasEntrada.lat.toFixed(5)}, {jornada.coordenadasEntrada.lng.toFixed(5)}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">No disponible</p>
                )}
              </div>
            </div>

            {/* Foto entrada */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <IonIcon icon={cameraOutline} className="text-orange-400 text-lg" />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-xs">Foto de entrada</p>
                {jornada.fotoEntrada ? (
                  <img
                    src={jornada.fotoEntrada}
                    alt="Foto de entrada"
                    className="mt-2 w-20 h-20 rounded-xl object-cover border border-white/10"
                  />
                ) : (
                  <p className="text-gray-500 text-sm">No disponible</p>
                )}
              </div>
            </div>
          </div>

          {/* Badge de sincronización */}
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${jornada.sincronizado ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
            <span className={`w-2 h-2 rounded-full ${jornada.sincronizado ? 'bg-green-400' : 'bg-yellow-400'}`} />
            <p className={`text-sm ${jornada.sincronizado ? 'text-green-400' : 'text-yellow-400'}`}>
              {jornada.sincronizado
                ? 'Jornada sincronizada con el servidor'
                : 'Guardada localmente — se sincronizará cuando haya conexión'}
            </p>
          </div>

          {/* Botón volver al home */}
          <button
            onClick={() => history.replace('/home')}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg shadow-blue-900/40 active:scale-95 transition-all mt-2"
          >
            <IonIcon icon={homeOutline} className="text-white text-xl" />
            <span className="text-white font-bold text-lg">Volver al inicio</span>
          </button>

        </div>
      </IonContent>
    </IonPage>
  );
}
