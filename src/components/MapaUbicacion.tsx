/**
 * MapaUbicacion
 * -------------
 * Muestra un mapa con un marcador en las coordenadas dadas y
 * resuelve la dirección aproximada via Nominatim (OpenStreetMap).
 *
 * No requiere API key. Usa tiles gratuitos de OpenStreetMap.
 *
 * Props:
 *   lat, lng   — coordenadas del punto
 *   label      — texto del tooltip del marcador (ej: "Entrada")
 *   height     — altura del mapa en px (default 200)
 */

import { useEffect, useState, useRef } from 'react';
import { IonIcon, IonSpinner } from '@ionic/react';
import { locationOutline, navigateOutline } from 'ionicons/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix del ícono por defecto de Leaflet con bundlers (Vite/Webpack)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Props {
  lat: number;
  lng: number;
  label?: string;
  height?: number;
}

interface NominatimResult {
  display_name: string;
  address: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

async function geocodificarInverso(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'es' },
    });
    if (!res.ok) throw new Error('Sin respuesta');
    const data: NominatimResult = await res.json();

    // Construir dirección legible con los campos disponibles
    const { address } = data;
    const partes = [
      address.road,
      address.neighbourhood ?? address.suburb,
      address.city ?? address.town ?? address.village,
      address.state,
    ].filter(Boolean);

    return partes.length > 0 ? partes.join(', ') : data.display_name;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

export default function MapaUbicacion({ lat, lng, label = 'Ubicación', height = 200 }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null);
  const leafletRef  = useRef<L.Map | null>(null);
  const [direccion, setDireccion] = useState<string | null>(null);
  const [loadingDir, setLoadingDir] = useState(true);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current) return;
    // Evitar doble inicialización (StrictMode / Ionic re-mount)
    if (leafletRef.current) {
      leafletRef.current.remove();
      leafletRef.current = null;
    }

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(label)
      .openPopup();

    leafletRef.current = map;

    return () => {
      map.remove();
      leafletRef.current = null;
    };
  }, [lat, lng, label]);

  // Geocodificación inversa
  useEffect(() => {
    setLoadingDir(true);
    geocodificarInverso(lat, lng).then((dir) => {
      setDireccion(dir);
      setLoadingDir(false);
    });
  }, [lat, lng]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Mapa */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height,
          borderRadius: 14,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          zIndex: 0,
        }}
      />

      {/* Dirección aproximada */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
        }}
      >
        <IonIcon
          icon={locationOutline}
          style={{ color: '#4ade80', fontSize: '1.125rem', marginTop: 1, flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <p style={{ color: '#64748b', fontSize: '0.7rem', margin: '0 0 2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Dirección aproximada
          </p>
          {loadingDir ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IonSpinner name="dots" style={{ color: '#3b82f6', width: 16, height: 16 }} />
              <span style={{ color: '#64748b', fontSize: '0.8125rem' }}>Buscando dirección...</span>
            </div>
          ) : (
            <p style={{ color: '#cbd5e1', fontSize: '0.8125rem', margin: 0, lineHeight: 1.4 }}>
              {direccion}
            </p>
          )}
        </div>
        {/* Coordenadas exactas */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <IonIcon icon={navigateOutline} style={{ color: '#475569', fontSize: '0.875rem' }} />
          <p style={{ color: '#475569', fontSize: '0.6875rem', margin: '2px 0 0' }}>
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
        </div>
      </div>
    </div>
  );
}
