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

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
  overflow: 'hidden',
};

const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: '16px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
};

const rowLast: React.CSSProperties = { ...row, borderBottom: 'none' };

const iconBox = (color: string): React.CSSProperties => ({
  width: 36,
  height: 36,
  borderRadius: 12,
  background: `${color}33`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export default function JornadaResumen() {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const jornada = location.state?.jornada;

  // Redirect en efecto, no durante el render
  useEffect(() => {
    if (!jornada) {
      history.replace('/home');
    }
  }, [jornada, history]);

  if (!jornada) return null;

  const esCompleta = jornada.horasTrabajadas >= 8;

  return (
    <IonPage>
      <IonContent fullscreen style={{ '--background': '#020617' }}>
        <div
          style={{
            minHeight: '100%',
            background: 'linear-gradient(to bottom right, #0f172a, #020617, #000)',
            color: 'white',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Encabezado */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 16 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: esCompleta ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)',
                border: `1px solid ${esCompleta ? 'rgba(34,197,94,0.4)' : 'rgba(234,179,8,0.4)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IonIcon
                icon={checkmarkCircleOutline}
                style={{ fontSize: '3rem', color: esCompleta ? '#4ade80' : '#facc15' }}
              />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, textAlign: 'center' }}>
              ¡Jornada finalizada!
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0, textAlign: 'center' }}>
              Aquí está el resumen de tu jornada de hoy
            </p>
          </div>

          {/* Duración principal */}
          <div
            style={{
              ...card,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Tiempo trabajado</p>
            <p style={{ fontSize: '3rem', fontWeight: 700, margin: 0 }}>
              {formatDuracion(jornada.duracionMinutos)}
            </p>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0, color: esCompleta ? '#4ade80' : '#facc15' }}>
              {esCompleta ? '✓ Jornada completa' : '⚠ Jornada incompleta'}
            </p>
          </div>

          {/* Detalles */}
          <div style={card}>
            {/* Fecha */}
            <div style={row}>
              <div style={iconBox('#3b82f6')}>
                <IonIcon icon={calendarOutline} style={{ color: '#60a5fa', fontSize: '1.125rem' }} />
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Fecha</p>
                <p style={{ fontWeight: 500, margin: 0 }}>{jornada.fecha}</p>
              </div>
            </div>

            {/* Hora entrada */}
            <div style={row}>
              <div style={iconBox('#22c55e')}>
                <IonIcon icon={timeOutline} style={{ color: '#4ade80', fontSize: '1.125rem' }} />
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Hora de entrada</p>
                <p style={{ fontWeight: 500, margin: 0 }}>{jornada.horaEntrada}</p>
              </div>
            </div>

            {/* Hora salida */}
            <div style={row}>
              <div style={iconBox('#ef4444')}>
                <IonIcon icon={timeOutline} style={{ color: '#f87171', fontSize: '1.125rem' }} />
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Hora de salida</p>
                <p style={{ fontWeight: 500, margin: 0 }}>{jornada.horaSalida}</p>
              </div>
            </div>

            {/* Horas trabajadas */}
            <div style={row}>
              <div style={iconBox('#a855f7')}>
                <IonIcon icon={timeOutline} style={{ color: '#c084fc', fontSize: '1.125rem' }} />
              </div>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Horas trabajadas</p>
                <p style={{ fontWeight: 500, margin: 0 }}>{jornada.horasTrabajadas.toFixed(2)} h</p>
              </div>
            </div>

            {/* Ubicación */}
            <div style={row}>
              <div style={iconBox('#14b8a6')}>
                <IonIcon icon={calendarOutline} style={{ color: '#2dd4bf', fontSize: '1.125rem' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Ubicación de entrada</p>
                {jornada.coordenadasEntrada ? (
                  <div style={{ marginTop: 8 }}>
                    <MapaUbicacion
                      lat={jornada.coordenadasEntrada.lat}
                      lng={jornada.coordenadasEntrada.lng}
                      label="Entrada"
                      height={180}
                    />
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>No disponible</p>
                )}
              </div>
            </div>

            {/* Foto */}
            <div style={rowLast}>
              <div style={iconBox('#f97316')}>
                <IonIcon icon={cameraOutline} style={{ color: '#fb923c', fontSize: '1.125rem' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Foto de entrada</p>
                {jornada.fotoDataUrl ? (
                  <img
                    src={jornada.fotoDataUrl}
                    alt="Foto de entrada"
                    style={{
                      marginTop: 8,
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      objectFit: 'cover',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'block',
                    }}
                  />
                ) : (
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>No disponible</p>
                )}
              </div>
            </div>
          </div>

          {/* Badge sincronización */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 12,
              background: jornada.sincronizado ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
              border: `1px solid ${jornada.sincronizado ? 'rgba(34,197,94,0.3)' : 'rgba(234,179,8,0.3)'}`,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: jornada.sincronizado ? '#4ade80' : '#facc15',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <p
              style={{
                fontSize: '0.875rem',
                margin: 0,
                color: jornada.sincronizado ? '#4ade80' : '#facc15',
              }}
            >
              {jornada.sincronizado
                ? 'Jornada sincronizada con el servidor'
                : 'Guardada localmente — se sincronizará cuando haya conexión'}
            </p>
          </div>

          {/* Botón volver */}
          <button
            onClick={() => history.replace('/home')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '20px 24px',
              background: 'linear-gradient(to right, #2563eb, #3b82f6)',
              border: 'none',
              borderRadius: 16,
              color: 'white',
              fontWeight: 700,
              fontSize: '1.125rem',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(30,64,175,0.4)',
              marginTop: 8,
            }}
          >
            <IonIcon icon={homeOutline} style={{ fontSize: '1.25rem' }} />
            Volver al inicio
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}
