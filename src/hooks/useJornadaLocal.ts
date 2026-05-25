/**
 * useJornadaLocal
 * ---------------
 * Maneja el ciclo completo de una jornada laboral.
 * Guarda en localStorage y sincroniza con el backend cuando hay conexión.
 *
 * Flujo con backend:
 *   1. iniciarJornada()  → POST /api/jornadas (marcar entrada)
 *      - Guarda localmente con sincronizado: false
 *      - Intenta llamar al backend; si responde, guarda idBackend y marca sincronizado: true
 *   2. finalizarJornada() → PATCH /api/jornadas/:idBackend/salida
 *      - Si hay idBackend: llama al backend directamente
 *      - Si no hay idBackend (offline): guarda localmente con sincronizado: false
 *   3. sincronizarPendientes() → sincroniza todos los registros offline
 *
 * Estructura en localStorage:
 *   - "jornada_activa"     → JornadaActiva | null
 *   - "jornadas_historial" → JornadaRegistro[]
 */

import { useState, useEffect } from 'react';
import { marcarEntrada, marcarSalida, MarcarEntradaDto, MarcarSalidaDto } from '../api/jornadaService';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface JornadaActiva {
  /** ISO string del momento en que se marcó entrada */
  horaEntrada: string;
  /** Foto tomada al iniciar (webPath de Capacitor Camera o URL de Storage) */
  fotoEntrada: string | null;
  /** Coordenadas al iniciar */
  coordenadasEntrada: { lat: number; lng: number } | null;
  /** ID del empleado en la tabla employees */
  idEmpleado: string | null;
  /** ID del registro en el backend (null si aún no se sincronizó la entrada) */
  idBackend: number | null;
}

export interface JornadaRegistro {
  /** ID local (prefijo "local_") o ID del backend como string */
  id: string;
  /** ID numérico del backend — null si nunca se sincronizó */
  idBackend: number | null;
  idEmpleado: string | null;
  fecha: string;             // YYYY-MM-DD
  horaEntrada: string;       // HH:MM:SS
  horaSalida: string;        // HH:MM:SS
  fotoEntrada: string | null;
  coordenadasEntrada: { lat: number; lng: number } | null;
  coordenadasSalida: { lat: number; lng: number } | null;
  duracionMinutos: number;
  horasTrabajadas: number;   // decimal, ej: 8.5
  horasExtra: number;        // calculado por el backend o localmente
  valorHorasExtra: number;   // calculado por el backend
  sincronizado: boolean;
}

// ─── Claves localStorage ─────────────────────────────────────────────────────

const KEY_ACTIVA    = 'jornada_activa';
const KEY_HISTORIAL = 'jornadas_historial';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function leerActiva(): JornadaActiva | null {
  try {
    const raw = localStorage.getItem(KEY_ACTIVA);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function leerHistorial(): JornadaRegistro[] {
  try {
    const raw = localStorage.getItem(KEY_HISTORIAL);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function guardarActiva(j: JornadaActiva | null) {
  if (j === null) localStorage.removeItem(KEY_ACTIVA);
  else localStorage.setItem(KEY_ACTIVA, JSON.stringify(j));
}

function guardarHistorial(h: JornadaRegistro[]) {
  localStorage.setItem(KEY_HISTORIAL, JSON.stringify(h));
}

function uid() {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function isoToHHMMSS(iso: string): string {
  return new Date(iso).toTimeString().slice(0, 8);
}

function isoToYYYYMMDD(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function minutosEntre(inicio: string, fin: string): number {
  return Math.round(
    (new Date(fin).getTime() - new Date(inicio).getTime()) / 60000
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useJornadaLocal() {
  const [jornadaActiva, setJornadaActiva] = useState<JornadaActiva | null>(leerActiva);
  const [historial, setHistorial]         = useState<JornadaRegistro[]>(leerHistorial);
  const [ultimaJornada, setUltimaJornada] = useState<JornadaRegistro | null>(null);
  const [syncError, setSyncError]         = useState<string | null>(null);

  useEffect(() => { guardarActiva(jornadaActiva); }, [jornadaActiva]);
  useEffect(() => { guardarHistorial(historial); }, [historial]);

  /**
   * PASO 1 — Inicia la jornada.
   * Guarda localmente y luego intenta sincronizar con el backend.
   * Si el backend falla, la jornada queda guardada offline (sincronizado: false).
   */
  const iniciarJornada = async (
    foto: string | null,
    coords: { lat: number; lng: number } | null,
    idEmpleado: string | null = null
  ): Promise<JornadaActiva> => {
    const ahora = new Date().toISOString();

    // Guardar localmente primero (offline-first)
    const nueva: JornadaActiva = {
      horaEntrada: ahora,
      fotoEntrada: foto,
      coordenadasEntrada: coords,
      idEmpleado,
      idBackend: null,
    };
    setJornadaActiva(nueva);
    setSyncError(null);

    // Intentar sincronizar con el backend
    if (idEmpleado) {
      try {
        const dto: MarcarEntradaDto = {
          id_empleado: idEmpleado,
          fecha: isoToYYYYMMDD(ahora),
          hora_entrada: isoToHHMMSS(ahora),
          ...(foto && { foto_entrada: foto }),
          ...(coords && { lat_entrada: coords.lat, lng_entrada: coords.lng }),
        };
        const respuesta = await marcarEntrada(dto);
        // Actualizar con el id del backend
        const conBackend: JornadaActiva = { ...nueva, idBackend: Number(respuesta.id) };
        setJornadaActiva(conBackend);
        return conBackend;
      } catch (err: any) {
        // Fallo de red → continuar offline
        setSyncError('Sin conexión. La jornada se sincronizará luego.');
        console.warn('[useJornadaLocal] No se pudo sincronizar entrada:', err.message);
      }
    }

    return nueva;
  };

  /**
   * PASO 2 — Finaliza la jornada activa.
   * Si hay idBackend: llama a PATCH /api/jornadas/:id/salida.
   * Si no hay idBackend (offline): guarda localmente con sincronizado: false.
   */
  const finalizarJornada = async (
    coords: { lat: number; lng: number } | null = null,
    descansoHoras: number = 0
  ): Promise<JornadaRegistro | null> => {
    if (!jornadaActiva) return null;

    const ahora   = new Date().toISOString();
    const minutos = minutosEntre(jornadaActiva.horaEntrada, ahora);

    // Registro base (calculado localmente)
    const registroBase: JornadaRegistro = {
      id: jornadaActiva.idBackend
        ? String(jornadaActiva.idBackend)
        : uid(),
      idBackend: jornadaActiva.idBackend,
      idEmpleado: jornadaActiva.idEmpleado,
      fecha: isoToYYYYMMDD(jornadaActiva.horaEntrada),
      horaEntrada: isoToHHMMSS(jornadaActiva.horaEntrada),
      horaSalida: isoToHHMMSS(ahora),
      fotoEntrada: jornadaActiva.fotoEntrada,
      coordenadasEntrada: jornadaActiva.coordenadasEntrada,
      coordenadasSalida: coords,
      duracionMinutos: minutos,
      horasTrabajadas: Math.round((minutos / 60) * 100) / 100,
      horasExtra: 0,
      valorHorasExtra: 0,
      sincronizado: false,
    };

    let registroFinal = registroBase;

    // Intentar sincronizar salida con el backend
    if (jornadaActiva.idBackend) {
      try {
        const dto: MarcarSalidaDto = {
          hora_salida: isoToHHMMSS(ahora),
          descanso_horas: descansoHoras,
          ...(coords && { lat_salida: coords.lat, lng_salida: coords.lng }),
        };
        const respuesta = await marcarSalida(jornadaActiva.idBackend, dto);
        // Enriquecer con los datos calculados por el backend
        registroFinal = {
          ...registroBase,
          horasTrabajadas: respuesta.horas_trabajadas ?? registroBase.horasTrabajadas,
          horasExtra: respuesta.horas_extra ?? 0,
          valorHorasExtra: respuesta.valor_horas_extra ?? 0,
          sincronizado: true,
        };
      } catch (err: any) {
        setSyncError('Sin conexión. La salida se sincronizará luego.');
        console.warn('[useJornadaLocal] No se pudo sincronizar salida:', err.message);
      }
    }

    setHistorial((prev) => [registroFinal, ...prev]);
    setJornadaActiva(null);
    setUltimaJornada(registroFinal);
    return registroFinal;
  };

  /**
   * Sincroniza todos los registros pendientes (sincronizado: false).
   * Llamar cuando se detecte que hay conexión (useNetwork).
   */
  const sincronizarPendientes = async () => {
    const pendientes = historial.filter((j) => !j.sincronizado);
    if (pendientes.length === 0) return;

    const actualizados = [...historial];

    for (const jornada of pendientes) {
      try {
        if (!jornada.idBackend && jornada.idEmpleado) {
          // Nunca se sincronizó la entrada → POST entrada
          const dtoEntrada: MarcarEntradaDto = {
            id_empleado: jornada.idEmpleado,
            fecha: jornada.fecha,
            hora_entrada: jornada.horaEntrada,
            ...(jornada.fotoEntrada && { foto_entrada: jornada.fotoEntrada }),
            ...(jornada.coordenadasEntrada && {
              lat_entrada: jornada.coordenadasEntrada.lat,
              lng_entrada: jornada.coordenadasEntrada.lng,
            }),
          };
          const respEntrada = await marcarEntrada(dtoEntrada);
          const idBackend   = Number(respEntrada.id);

          // PATCH salida con el id recién obtenido
          const dtoSalida: MarcarSalidaDto = {
            hora_salida: jornada.horaSalida,
            ...(jornada.coordenadasSalida && {
              lat_salida: jornada.coordenadasSalida.lat,
              lng_salida: jornada.coordenadasSalida.lng,
            }),
          };
          const respSalida = await marcarSalida(idBackend, dtoSalida);

          const idx = actualizados.findIndex((j) => j.id === jornada.id);
          if (idx !== -1) {
            actualizados[idx] = {
              ...actualizados[idx],
              id: String(idBackend),
              idBackend,
              horasTrabajadas: respSalida.horas_trabajadas ?? jornada.horasTrabajadas,
              horasExtra: respSalida.horas_extra ?? 0,
              valorHorasExtra: respSalida.valor_horas_extra ?? 0,
              sincronizado: true,
            };
          }
        } else if (jornada.idBackend) {
          // Entrada sincronizada pero salida no → solo PATCH salida
          const dtoSalida: MarcarSalidaDto = {
            hora_salida: jornada.horaSalida,
            ...(jornada.coordenadasSalida && {
              lat_salida: jornada.coordenadasSalida.lat,
              lng_salida: jornada.coordenadasSalida.lng,
            }),
          };
          const respSalida = await marcarSalida(jornada.idBackend, dtoSalida);

          const idx = actualizados.findIndex((j) => j.id === jornada.id);
          if (idx !== -1) {
            actualizados[idx] = {
              ...actualizados[idx],
              horasTrabajadas: respSalida.horas_trabajadas ?? jornada.horasTrabajadas,
              horasExtra: respSalida.horas_extra ?? 0,
              valorHorasExtra: respSalida.valor_horas_extra ?? 0,
              sincronizado: true,
            };
          }
        }
      } catch (err: any) {
        console.warn('[useJornadaLocal] Error sincronizando jornada:', jornada.id, err.message);
      }
    }

    setHistorial(actualizados);
    setSyncError(null);
  };

  /** Cancela la jornada activa sin guardar */
  const cancelarJornada = () => {
    setJornadaActiva(null);
  };

  /** Elimina un registro del historial local */
  const eliminarRegistro = (id: string) => {
    setHistorial((prev) => prev.filter((j) => j.id !== id));
  };

  return {
    jornadaActiva,
    historial,
    ultimaJornada,
    syncError,
    iniciarJornada,
    finalizarJornada,
    cancelarJornada,
    eliminarRegistro,
    sincronizarPendientes,
  };
}
