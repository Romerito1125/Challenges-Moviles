import { IonPage, IonContent, IonIcon } from '@ionic/react';
import {
  checkmarkCircleOutline,
  timeOutline,
  calendarOutline,
  cameraOutline,
  homeOutline,
} from 'ionicons/icons';
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { JornadaRegistro } from '../hooks/useJornadaLocal';
import MapaUbicacion from '../components/MapaUbicacion';

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

function DetailRow({
  iconColor,
  iconBg,
  icon,
  label,
  children,
  last = false,
}: {
  iconColor: string;
  iconBg: string;
  icon: string;
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`flex items-start gap-4 px-5 py-4 ${last ? '' : 'border-b border-white/10'}`}>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <IonIcon icon={icon} style={{ color: iconColor, fontSize: '1.125rem' }} />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

export default function JornadaResumen() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const jornada = location.state?.jornada;

  useEffect(() => {
    if (!jornada) history.replace('/home');
  }, [jornada, history]);

  if (!jornada) return null;

  const esCompleta = jornada.horasTrabajadas >= 8;

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#020617' }}>
        <div className="min-h-full bg-linear-to-br from-slate-900 via-slate-950 to-black text-white px-6 py-10 flex flex-col gap-6">

          {/* Encabezado */}
          <div className="flex flex-col items-center gap-3 pt-4">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center border ${
                esCompleta
                  ? 'bg-green-500/20 border-green-500/40'
                  : 'bg-yellow-500/20 border-yellow-500/40'
              }`}
            >
              <IonIcon
                icon={checkmarkCircleOutline}
                className={`text-5xl ${esCompleta ? 'text-green-400' : 'text-yellow-400'}`}
              />
            </div>
            <h1 className="text-2xl font-bold text-center m-0">¡Jornada finalizada!</h1>
            <p className="text-gray-400 text-sm text-center m-0">
              Aquí está el resumen de tu jornada de hoy
            </p>
          </div>

          {/* Duración principal */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-2">
            <p className="text-gray-400 text-sm m-0">Tiempo trabajado</p>
            <p className="text-5xl font-bold m-0">{formatDuracion(jornada.duracionMinutos)}</p>
            <p className={`text-sm font-medium m-0 ${esCompleta ? 'text-green-400' : 'text-yellow-400'}`}>
              {esCompleta ? '✓ Jornada completa' : '⚠ Jornada incompleta'}
            </p>
          </div>

          {/* Detalles */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <DetailRow icon={calendarOutline} iconColor="#60a5fa" iconBg="rgba(59,130,246,0.2)" label="Fecha">
              <p className="text-gray-400 text-xs m-0">Fecha</p>
              <p className="font-medium m-0">{jornada.fecha}</p>
            </DetailRow>

            <DetailRow icon={timeOutline} iconColor="#4ade80" iconBg="rgba(34,197,94,0.2)" label="Hora entrada">
              <p className="text-gray-400 text-xs m-0">Hora de entrada</p>
              <p className="font-medium m-0">{jornada.horaEntrada}</p>
            </DetailRow>

            <DetailRow icon={timeOutline} iconColor="#f87171" iconBg="rgba(239,68,68,0.2)" label="Hora salida">
              <p className="text-gray-400 text-xs m-0">Hora de salida</p>
              <p className="font-medium m-0">{jornada.horaSalida}</p>
            </DetailRow>

            <DetailRow icon={timeOutline} iconColor="#c084fc" iconBg="rgba(168,85,247,0.2)" label="Horas trabajadas">
              <p className="text-gray-400 text-xs m-0">Horas trabajadas</p>
              <p className="font-medium m-0">{jornada.horasTrabajadas.toFixed(2)} h</p>
            </DetailRow>

            <DetailRow icon={calendarOutline} iconColor="#2dd4bf" iconBg="rgba(20,184,166,0.2)" label="Ubicación">
              <p className="text-gray-400 text-xs m-0">Ubicación de entrada</p>
              {jornada.coordenadasEntrada ? (
                <div className="mt-2">
                  <MapaUbicacion
                    lat={jornada.coordenadasEntrada.lat}
                    lng={jornada.coordenadasEntrada.lng}
                    label="Entrada"
                    height={180}
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-sm m-0">No disponible</p>
              )}
            </DetailRow>

            <DetailRow icon={cameraOutline} iconColor="#fb923c" iconBg="rgba(249,115,22,0.2)" label="Foto" last>
              <p className="text-gray-400 text-xs m-0">Foto de entrada</p>
              {jornada.fotoDataUrl ? (
                <img
                  src={jornada.fotoDataUrl}
                  alt="Foto de entrada"
                  className="mt-2 w-20 h-20 rounded-xl object-cover border border-white/10 block"
                />
              ) : (
                <p className="text-gray-500 text-sm m-0">No disponible</p>
              )}
            </DetailRow>
          </div>

          {/* Badge sincronización */}
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${
              jornada.sincronizado
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 inline-block ${
                jornada.sincronizado ? 'bg-green-400' : 'bg-yellow-400'
              }`}
            />
            <p className={`text-sm m-0 ${jornada.sincronizado ? 'text-green-400' : 'text-yellow-400'}`}>
              {jornada.sincronizado
                ? 'Jornada sincronizada con el servidor'
                : 'Guardada localmente — se sincronizará cuando haya conexión'}
            </p>
          </div>

          {/* Botón volver */}
          <button
            onClick={() => history.replace('/home')}
            className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-linear-to-r from-blue-600 to-blue-500 border-none rounded-2xl text-white font-bold text-lg cursor-pointer shadow-[0_10px_25px_rgba(30,64,175,0.4)] mt-2"
          >
            <IonIcon icon={homeOutline} className="text-xl" />
            Volver al inicio
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}
