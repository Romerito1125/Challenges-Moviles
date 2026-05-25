import { IonPage, IonContent, IonIcon } from "@ionic/react";
import { arrowBackOutline, saveOutline, locationOutline } from "ionicons/icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";

export default function WorkLocation() {
  const history = useHistory();
  const [radio, setRadio] = useState("");

  return (
    <IonPage style={{ '--background': '#020617', background: '#020617' }}>
      <IonContent fullscreen style={{ '--background': '#020617' }}>
        <div
          style={{
            minHeight: '100%',
            background: 'linear-gradient(to bottom right, #0f172a, #020617, #000)',
            color: 'white',
            padding: '48px 24px 40px',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => history.goBack()}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              <IonIcon icon={arrowBackOutline} style={{ color: 'white', fontSize: '1.25rem' }} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.375rem', fontWeight: 700, margin: 0 }}>
                Ubicación de trabajo
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.8125rem', margin: '2px 0 0' }}>
                Configura el área de trabajo permitida
              </p>
            </div>
          </div>

          {/* Mapa placeholder */}
          <div
            style={{
              height: 260,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <IonIcon icon={locationOutline} style={{ color: '#3b82f6', fontSize: '2.5rem' }} />
            <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0 }}>
              Mapa próximamente
            </p>
          </div>

          {/* Input radio */}
          <div
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              padding: '16px 20px',
            }}
          >
            <label style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Radio permitido (metros)
            </label>
            <input
              type="number"
              placeholder="Ej: 100"
              value={radio}
              onChange={(e) => setRadio(e.target.value)}
              style={{
                display: 'block',
                width: '100%',
                marginTop: 8,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: 500,
              }}
            />
          </div>

          {/* Botón guardar */}
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '16px 24px',
              background: 'linear-gradient(to right, #2563eb, #3b82f6)',
              border: 'none',
              borderRadius: 16,
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
            }}
          >
            <IonIcon icon={saveOutline} style={{ fontSize: '1.25rem' }} />
            Guardar ubicación
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}
