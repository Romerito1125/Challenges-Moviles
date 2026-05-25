import axiosClient from './axiosClient';
import { ApiResponse } from './employeeService';

export interface Pago {
  id?: string | number;
  idempleado: string | number;
  totalpago: number;
  fechaprogramada: string; // YYYY-MM-DD
}

/** Cuerpo para crear un pago. POST /api/pagos
 *  { idEmpleado, totalPago (entero positivo), fechaProgramada (YYYY-MM-DD) }
 */
export interface CreatePagoDto {
  idEmpleado: string | number;
  totalPago: number;
  fechaProgramada: string;
}

/** Cuerpo para actualizar un pago. PUT /api/pagos/:id
 *  Todos los campos son opcionales; al menos uno debe enviarse.
 */
export type UpdatePagoDto = Partial<CreatePagoDto>;

// GET /api/pagos
export const getPagos = async (): Promise<Pago[]> => {
  const { data } = await axiosClient.get<ApiResponse<Pago[]>>('/pagos');
  return data.data ?? [];
};

// GET /api/pagos/:id
export const getPagoById = async (id: string | number): Promise<Pago> => {
  const { data } = await axiosClient.get<ApiResponse<Pago>>(`/pagos/${id}`);
  return data.data!;
};

/** GET /api/pagos/empleado/:idEmpleado — todos los pagos de un empleado */
export const getPagosByEmpleado = async (idEmpleado: string | number): Promise<Pago[]> => {
  const { data } = await axiosClient.get<ApiResponse<Pago[]>>(`/pagos/empleado/${idEmpleado}`);
  return data.data ?? [];
};

// POST /api/pagos
export const createPago = async (dto: CreatePagoDto): Promise<Pago> => {
  const { data } = await axiosClient.post<ApiResponse<Pago>>('/pagos', dto);
  return data.data!;
};

// PUT /api/pagos/:id
export const updatePago = async (id: string | number, dto: UpdatePagoDto): Promise<Pago> => {
  const { data } = await axiosClient.put<ApiResponse<Pago>>(`/pagos/${id}`, dto);
  return data.data!;
};

// DELETE /api/pagos/:id
export const deletePago = async (id: string | number): Promise<void> => {
  await axiosClient.delete(`/pagos/${id}`);
};
