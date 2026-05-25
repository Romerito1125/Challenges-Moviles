/**
 * useJornadaLocal
 * ---------------
 * Maneja el ciclo completo de una jornada laboral.
 *
 * Almacenamiento:
 *   - localStorage  → datos ligeros (timestamps, coords, ids, flags)
 *   - IndexedDB     → fotos en base64 (pueden pesar varios MB)
 *
 * Las fotos se guardan en IndexedDB con un ID único.
 * En localStorage y en los objetos de estado solo se guarda ese ID.
 * Al leer, se resuelve el dataUrl desde IndexedDB bajo demanda.
 */

import { useState, useEffect } from 'react';
import db from '../dexie/config';
import { marcarEntrada, marcarSalida, MarcarEntradaDto, MarcarSalidaDto } from '../api/jornadaService';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface JornadaActiva {
  horaEntrada: string;
  /** ID de la foto en IndexedDB (null si no hay foto) */
  fotoId: string | null;
  /** dataUrl resuelto en memoria — NO se persiste en localStorage */
  fotoDataUrl?: string | null;
  coordenadasEntrada: { lat: number; lng: number } | null;
  idEmpleado: string | null;
  idBackend: number | null;
}

export interface JornadaRegistro {
  id: string;
  idBackend: number | null;
  idEmpleado: string | null;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  /** ID de la foto en IndexedDB */
  fotoId: string | null;
  /** dataUrl resuelto en memoria — NO se persiste en localStorage */
  fotoDataUrl?: string | null;
  coordenadasEntrada: { lat: number; lng: number } | null;
  coordenadasSalida: { lat: number; lng: number } | null;
  duracionMinutos: number;
  horasTrabajadas: number;
  horasExtra: number;
  valorHorasExtra: number;
  sincronizado: boolean;
}

// ─── Claves localStorage ─────────────────────────────────────────────────────

const KEY_ACTIVA    = 'jornada_activa';
const KEY_HISTORIAL = 'jornadas_historial';

// ─── Helpers localStorage ────────────────────────────────────────────────────

/** Lo que realmente se persiste en localStorage (sin dataUrl) */
type JornadaActivaStorage = Omit<JornadaActiva, 'fotoDataUrl'>;
type JornadaRegistroStorage = Omit<JornadaRegistro, 'fotoDataUrl'>;

function leerActiva(): JornadaActivaStorage | null {
  try {
    const raw = localStorage.getItem(KEY_ACTIVA);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function leerHistorial(): JornadaRegistroStorage[] {
  try {
    const raw = localStorage.getItem(KEY_HISTORIAL);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function guardarActiva(j: JornadaActivaStorage | null) {
  if (j === null) {
    localStorage.removeItem(KEY_ACTIVA);
  } else {
    // Nunca guardar fotoDataUrl en localStorage
    const { fotoDataUrl: _, ...sinFoto } = j as any;
    localStorage.setItem(KEY_ACTIVA, JSON.stringify(sinFoto));
  }
}

function guardarHistorial(h: JornadaRegistroStorage[]) {
  // Nunca guardar fotoDataUrl en localStorage
  const limpio = h.map(({ fotoDataUrl: _, ...rest }: any) => rest);
  localStorage.setItem(KEY_HISTORIAL, JSON.stringify(limpio));
}

function uid() {
  return `foto_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function isoToHHMMSS(iso: string): string {
  const d = new Date(iso);
  // Usar hora local explícita para evitar desfase por zona horaria
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  const s = String(d.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function isoToYYYYMMDD(iso: string): string {
  const d = new Date(iso);
  // Usar fecha local explícita para evitar que UTC cambie el día
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

function minutosEntre(inicio: string, fin: string): number {
  const tsInicio = new Date(inicio).getTime();
  const tsFin    = new Date(fin).getTime();

  // Guardia: si alguno es inválido o el resultado es negativo/absurdo, devolver 0
  if (isNaN(tsInicio) || isNaN(tsFin) || tsFin <= tsInicio) return 0;

  const minutos = Math.round((tsFin - tsInicio) / 60000);

  // Guardia: una jornada no puede superar 24 horas (1440 min)
  return Math.min(minutos, 1440);
}

// ─── Helpers IndexedDB ───────────────────────────────────────────────────────

async function guardarFoto(dataUrl: string): Promise<string> {
  const id = uid();
  await db.fotos.put({ id, dataUrl, createdAt: Date.now() });
  return id;
}

async function leerFoto(id: string | null): Promise<string | null> {
  if (!id) return null;
  try {
    const entry = await db.fotos.get(id);
    return entry?.dataUrl ?? null;
  } catch { return null; }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useJornadaLocal() {
  const [jornadaActiva, setJornadaActiva] = useState<JornadaActiva | null>(null);
  const [historial, setHistorial]         = useState<JornadaRegistro[]>([]);
  const [ultimaJornada, setUltimaJornada] = useState<JornadaRegistro | null>(null);
  const [syncError, setSyncError]         = useState<string | null>(null);
  const [listo, setListo]                 = useState(false);

  // Al montar: leer localStorage y resolver fotos desde IndexedDB
  useEffect(() => {
    async function cargar() {
      const activa = leerActiva();
      if (activa) {
        const fotoDataUrl = await leerFoto(activa.fotoId);
        setJornadaActiva({ ...activa, fotoDataUrl });
      }

      const hist = leerHistorial();
      const histConFotos = await Promise.all(
        hist.map(async (j) => ({
          ...j,
          fotoDataUrl: await leerFoto(j.fotoId),
        }))
      );
      setHistorial(histConFotos);
      setListo(true);
    }
    cargar();
  }, []);

  // Persistir jornada activa en localStorage cuando cambia (sin la foto)
  useEffect(() => {
    if (!listo) return;
    guardarActiva(jornadaActiva);
  }, [jornadaActiva, listo]);

  // Persistir historial en localStorage cuando cambia (sin las fotos)
  useEffect(() => {
    if (!listo) return;
    guardarHistorial(historial);
  }, [historial, listo]);

  /**
   * PASO 1 — Inicia la jornada.
   * Guarda la foto en IndexedDB, el resto en localStorage.
   * Intenta sincronizar con el backend.
   */
  const iniciarJornada = async (
    fotoDataUrl: string | null,
    coords: { lat: number; lng: number } | null,
    idEmpleado: string | null = null
  ): Promise<JornadaActiva> => {
    const ahora = new Date().toISOString();

    // Guardar foto en IndexedDB (no en localStorage)
    const fotoId = fotoDataUrl ? await guardarFoto(fotoDataUrl) : null;

    const nueva: JornadaActiva = {
      horaEntrada: ahora,
      fotoId,
      fotoDataUrl,   // solo en memoria
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
          ...(coords && { lat_entrada: coords.lat, lng_entrada: coords.lng }),
        };
        const respuesta = await marcarEntrada(dto);
        const conBackend: JornadaActiva = { ...nueva, idBackend: Number(respuesta.id) };
        setJornadaActiva(conBackend);
        return conBackend;
      } catch (err: any) {
        setSyncError('Sin conexión. La jornada se sincronizará luego.');
        console.warn('[useJornadaLocal] No se pudo sincronizar entrada:', err.message);
      }
    }

    return nueva;
  };

  /**
   * PASO 2 — Finaliza la jornada activa.
   */
  const finalizarJornada = async (
    coords: { lat: number; lng: number } | null = null,
    descansoHoras: number = 0
  ): Promise<JornadaRegistro | null> => {
    if (!jornadaActiva) return null;

    const ahora   = new Date().toISOString();
    const minutos = minutosEntre(jornadaActiva.horaEntrada, ahora);

    const registroBase: JornadaRegistro = {
      id: jornadaActiva.idBackend ? String(jornadaActiva.idBackend) : uid(),
      idBackend: jornadaActiva.idBackend,
      idEmpleado: jornadaActiva.idEmpleado,
      fecha: isoToYYYYMMDD(jornadaActiva.horaEntrada),
      horaEntrada: isoToHHMMSS(jornadaActiva.horaEntrada),
      horaSalida: isoToHHMMSS(ahora),
      fotoId: jornadaActiva.fotoId,
      fotoDataUrl: jornadaActiva.fotoDataUrl,
      coordenadasEntrada: jornadaActiva.coordenadasEntrada,
      coordenadasSalida: coords,
      duracionMinutos: minutos,
      horasTrabajadas: Math.round((minutos / 60) * 100) / 100,
      horasExtra: 0,
      valorHorasExtra: 0,
      sincronizado: false,
    };

    let registroFinal = registroBase;

    if (jornadaActiva.idBackend) {
      try {
        const dto: MarcarSalidaDto = {
          hora_salida: isoToHHMMSS(ahora),
          descanso_horas: descansoHoras,
          ...(coords && { lat_salida: coords.lat, lng_salida: coords.lng }),
        };
        const respuesta = await marcarSalida(jornadaActiva.idBackend, dto);
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
   * Sincroniza todos los registros pendientes.
   */
  const sincronizarPendientes = async () => {
    const pendientes = historial.filter((j) => !j.sincronizado);
    if (pendientes.length === 0) return;

    const actualizados = [...historial];

    for (const jornada of pendientes) {
      try {
        if (!jornada.idBackend && jornada.idEmpleado) {
          const dtoEntrada: MarcarEntradaDto = {
            id_empleado: jornada.idEmpleado,
            fecha: jornada.fecha,
            hora_entrada: jornada.horaEntrada,
            ...(jornada.coordenadasEntrada && {
              lat_entrada: jornada.coordenadasEntrada.lat,
              lng_entrada: jornada.coordenadasEntrada.lng,
            }),
          };
          const respEntrada = await marcarEntrada(dtoEntrada);
          const idBackend   = Number(respEntrada.id);

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
        console.warn('[useJornadaLocal] Error sincronizando:', jornada.id, err.message);
      }
    }

    setHistorial(actualizados);
    setSyncError(null);
  };

  const cancelarJornada = () => setJornadaActiva(null);

  const eliminarRegistro = (id: string) => {
    setHistorial((prev) => prev.filter((j) => j.id !== id));
  };

  return {
    jornadaActiva,
    historial,
    ultimaJornada,
    syncError,
    listo,
    iniciarJornada,
    finalizarJornada,
    cancelarJornada,
    eliminarRegistro,
    sincronizarPendientes,
  };
}
