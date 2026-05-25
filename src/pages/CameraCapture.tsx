/**
 * CameraCapture
 * -------------
 * Pantalla intermedia que se muestra al pulsar "Marcar Entrada".
 * Flujo:
 *   1. El empleado llega a esta pantalla.
 *   2. Pulsa "Tomar foto" → se activa la cámara (Capacitor Camera).
 *   3. Se muestra la foto tomada.
 *   4. Pulsa "Verificar y comenzar jornada" → se guarda la jornada en localStorage
 *      y se redirige a /home con la jornada activa.
 *   5. Puede pulsar "Cancelar" para volver sin iniciar jornada.
 */

import {
  IonPage,
  IonContent,
  IonButton,
  IonSpinner,
  IonIcon,
} from '@ionic/react';
import { cameraOutline, checkmarkCircleOutline, closeOutline, locationOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCamera } from '../hooks/useCamera';
import { useGeolocation } from '../hooks/useGeolocation';
import { useJornada } from '../context/JornadaContext';
import { useAuthContext } from '../context/AuthContext';
import { getMyEmployeeId } from '../api/employeeService';

export default function CameraCapture() {
  const history = useHistory();
  const { takePhoto, photo } = useCamera();
  const { position, error: geoError, getCurrentLocation } = useGeolocation();
  const { iniciarJornada } = useJornada();
  const { user } = useAuthContext();

  const [loadingGeo, setLoadingGeo] = useState(false);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [iniciando, setIniciando] = useState(false);
  const [geoObtenida, setGeoObtenida] = useState(false);

  // Obtener ubicación al montar la pantalla
  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = async () => {
    setLoadingGeo(true);
    await getCurrentLocation();
    setLoadingGeo(false);
    setGeoObtenida(true);
  };

  const handleTakePhoto = async () => {
    setLoadingPhoto(true);
    try {
      await takePhoto();
    } catch (err) {
      console.error('Error al tomar foto:', err);
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleVerificar = async () => {
    if (!photo) return;

    setIniciando(true);

    const coords = position
      ? { lat: position.latitude, lng: position.longitude }
      : null;

    // Resolver el id numérico del empleado desde el backend.
    // user?.id es el UUID de Supabase Auth, pero el backend necesita
    // el id numérico de la tabla employees (ej: 5).
    const idEmpleado = await getMyEmployeeId();

    await iniciarJornada(photo, coords, idEmpleado ? String(idEmpleado) : null);

    history.replace('/home');
  };

  const handleCancelar = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <IonContent style={{ '--background': '#020617' }}>
        <div className="min-h-screen bg-linear-to-br from-[#0f172a] via-[#020617] to-black text-white flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-10 pb-4">
            <div>
              <h1 className="text-2xl font-bold">Verificación de entrada</h1>
              <p className="text-gray-400 text-sm mt-1">
                Toma una foto para registrar tu entrada
              </p>
            </div>
            <button
              onClick={handleCancelar}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            >
              <IonIcon icon={closeOutline} className="text-white text-xl" />
            </button>
          </div>

          {/* Área de foto */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">

            {/* Preview de la foto */}
            <div className="w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center">
              {photo ? (
                <img
                  src={photo}
                  alt="Foto de entrada"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-500">
                  <IonIcon icon={cameraOutline} className="text-6xl" />
                  <p className="text-sm">Sin foto aún</p>
                </div>
              )}
            </div>

            {/* Botón tomar foto */}
            <button
              onClick={handleTakePhoto}
              disabled={loadingPhoto}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all rounded-2xl shadow-lg shadow-blue-900/40 disabled:opacity-50"
            >
              {loadingPhoto ? (
                <IonSpinner name="crescent" className="text-white" />
              ) : (
                <IonIcon icon={cameraOutline} className="text-white text-2xl" />
              )}
              <span className="text-white font-semibold text-lg">
                {photo ? 'Tomar otra foto' : 'Tomar foto'}
              </span>
            </button>

            {/* Estado de geolocalización */}
            <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <IonIcon
                icon={locationOutline}
                className={`text-xl ${geoObtenida && position ? 'text-green-400' : geoError ? 'text-red-400' : 'text-gray-400'}`}
              />
              <div className="flex-1">
                {loadingGeo ? (
                  <div className="flex items-center gap-2">
                    <IonSpinner name="dots" className="text-blue-400" />
                    <span className="text-gray-400 text-sm">Obteniendo ubicación...</span>
                  </div>
                ) : geoError ? (
                  <div>
                    <p className="text-red-400 text-sm font-medium">Sin acceso a ubicación</p>
                    <p className="text-gray-500 text-xs">La jornada se registrará sin coordenadas</p>
                  </div>
                ) : position ? (
                  <div>
                    <p className="text-green-400 text-sm font-medium">Ubicación obtenida ✓</p>
                    <p className="text-gray-500 text-xs">
                      {position.latitude.toFixed(5)}, {position.longitude.toFixed(5)}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Esperando ubicación...</p>
                )}
              </div>
              {!loadingGeo && (
                <button
                  onClick={handleGetLocation}
                  className="text-blue-400 text-xs underline"
                >
                  Reintentar
                </button>
              )}
            </div>
          </div>

          {/* Botón verificar */}
          <div className="px-6 pb-10 pt-4">
            <button
              onClick={handleVerificar}
              disabled={!photo || iniciando}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-linear-to-r from-green-600 to-emerald-500 rounded-2xl shadow-lg shadow-green-900/40 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {iniciando ? (
                <IonSpinner name="crescent" className="text-white" />
              ) : (
                <>
                  <IonIcon icon={checkmarkCircleOutline} className="text-white text-2xl" />
                  <span className="text-white font-bold text-lg">
                    Verificar y comenzar jornada
                  </span>
                </>
              )}
            </button>
            {!photo && (
              <p className="text-center text-gray-500 text-sm mt-3">
                Debes tomar una foto para continuar
              </p>
            )}
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
}
