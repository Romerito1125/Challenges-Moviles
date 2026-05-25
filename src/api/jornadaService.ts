import axiosClient from './axiosClient';
import { ApiResponse } from './employeeService';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Jornada {
  id?: string | number;
  id_empleado: string | number;
  fecha: string;                  // YYYY-MM-DD
  hora_entrada: string;           // HH:MM:SS
  hora_salida: string | null;     // null hasta que se marque salida
  foto_entrada?: string | null;   // URL en Supabase Storage
  lat_entrada?: number | null;
  lng_entrada?: number | null;
  lat_salida?: number | null;
  lng_salida?: number | null;
  descanso_horas: number;
  horas_trabajadas?: number;
  horas_extra?: number;
  valor_horas_extra?: number;     // calculado por el backend, no persiste en BD
}

/** PASO 1 — Marcar entrada. POST /api/jornadas
 *  hora_salida NO se incluye; el backend la deja en null.
 */
export interface MarcarEntradaDto {
  id_empleado: string | number;
  fecha: string;           // YYYY-MM-DD
  hora_entrada: string;    // HH:MM:SS
  foto_entrada?: string;   // URL ya subida a Supabase Storage
  lat_entrada?: number;
  lng_entrada?: number;
}

/** PASO 2 — Marcar salida. PATCH /api/jornadas/:id/salida */
export interface MarcarSalidaDto {
  hora_salida: string;     // HH:MM:SS — requerido
  lat_salida?: number;
  lng_salida?: number;
  descanso_horas?: number; // default 0
}

/** Edición completa por admin. PUT /api/jornadas/:id */
export interface UpdateJornadaDto {
  fecha?: string;
  hora_entrada?: string;
  hora_salida?: string;
  foto_entrada?: string;
  lat_entrada?: number;
  lng_entrada?: number;
  lat_salida?: number;
  lng_salida?: number;
  descanso_horas?: number;
}

// Alias para compatibilidad con useJornadas (hook admin)
export type CreateJornadaDto = MarcarEntradaDto;

// ─── Endpoints ───────────────────────────────────────────────────────────────

/** PASO 1: POST /api/jornadas — registra la entrada, devuelve el registro con id */
export const marcarEntrada = async (dto: MarcarEntradaDto): Promise<Jornada> => {
  const { data } = await axiosClient.post<ApiResponse<Jornada>>('/jornadas', dto);
  return data.data!;
};

/** PASO 2: PATCH /api/jornadas/:id/salida — cierra la jornada con hora de salida */
export const marcarSalida = async (
  id: string | number,
  dto: MarcarSalidaDto
): Promise<Jornada> => {
  const { data } = await axiosClient.patch<ApiResponse<Jornada>>(
    `/jornadas/${id}/salida`,
    dto
  );
  return data.data!;
};

/** GET /api/jornadas/empleado/:idEmpleado */
export const getJornadasByEmpleado = async (
  idEmpleado: string | number
): Promise<Jornada[]> => {
  const { data } = await axiosClient.get<ApiResponse<Jornada[]>>(
    `/jornadas/empleado/${idEmpleado}`
  );
  return data.data ?? [];
};

/** PUT /api/jornadas/:id — edición completa (admin) */
export const updateJornada = async (
  id: string | number,
  dto: UpdateJornadaDto
): Promise<Jornada> => {
  const { data } = await axiosClient.put<ApiResponse<Jornada>>(
    `/jornadas/${id}`,
    dto
  );
  return data.data!;
};

/** DELETE /api/jornadas/:id */
export const deleteJornada = async (id: string | number): Promise<void> => {
  await axiosClient.delete(`/jornadas/${id}`);
};

// ─── Resumen extras ──────────────────────────────────────────────────────────

export interface ResumenExtras {
  id_empleado: number;
  total_horas_extra: number;
  valor_hora_extra: number;
  total_valor_extras: number;
}

/** GET /api/jornadas/empleado/:idEmpleado/resumen-extras */
export const getResumenExtrasEmpleado = async (
  idEmpleado: string | number
): Promise<ResumenExtras> => {
  const { data } = await axiosClient.get<ApiResponse<ResumenExtras>>(
    `/jornadas/empleado/${idEmpleado}/resumen-extras`
  );
  return data.data!;
};

// ─── Alias legacy (para no romper useJornadas del admin) ─────────────────────
/** @deprecated Usar marcarEntrada() + marcarSalida() en su lugar */
export const createJornada = marcarEntrada;
