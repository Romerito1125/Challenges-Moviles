import axiosClient from './axiosClient';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface Employee {
  id?: string | number;
  auth_user_id?: string | null;   // UUID de Supabase Auth — lo asigna el backend
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;                  // requerido para la invitación por email
  salario: number;
  rol?: 'empleado' | 'admin';     // default 'empleado'
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// ─── Endpoints ───────────────────────────────────────────────────────────────

/** GET /api/employees */
export const getEmployees = async (): Promise<Employee[]> => {
  const { data } = await axiosClient.get<ApiResponse<Employee[]>>('/employees');
  return data.data ?? [];
};

/** GET /api/employees/:id */
export const getEmployeeById = async (id: string | number): Promise<Employee> => {
  const { data } = await axiosClient.get<ApiResponse<Employee>>(`/employees/${id}`);
  return data.data!;
};

/**
 * GET /api/employees/me
 * El backend identifica al empleado por el auth_user_id del token JWT.
 * Devuelve el perfil del empleado logueado.
 */
export const getMyProfile = async (): Promise<Employee> => {
  const { data } = await axiosClient.get<ApiResponse<Employee>>('/employees/me');
  return data.data!;
};

/**
 * Resuelve el id numérico del empleado logueado desde el backend.
 * Cachea el resultado en sessionStorage para no repetir la llamada.
 */
export const getMyEmployeeId = async (): Promise<number | null> => {
  const cached = sessionStorage.getItem('employee_id');
  if (cached) return Number(cached);
  try {
    const emp = await getMyProfile();
    if (emp.id) {
      sessionStorage.setItem('employee_id', String(emp.id));
      return Number(emp.id);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * POST /api/employees
 * Crea el empleado Y envía la invitación por email automáticamente.
 * El frontend NO llama a Supabase Auth directamente para esto.
 */
export const createEmployee = async (
  employee: Omit<Employee, 'id' | 'auth_user_id' | 'activo' | 'created_at' | 'updated_at'>
): Promise<Employee> => {
  const { data } = await axiosClient.post<ApiResponse<Employee>>('/employees', employee);
  return data.data!;
};

/** PUT /api/employees/:id */
export const updateEmployee = async (
  id: string | number,
  updates: Partial<Omit<Employee, 'id' | 'auth_user_id' | 'created_at' | 'updated_at'>>
): Promise<Employee> => {
  const { data } = await axiosClient.put<ApiResponse<Employee>>(
    `/employees/${id}`,
    updates
  );
  return data.data!;
};

/** DELETE /api/employees/:id */
export const deleteEmployee = async (id: string | number): Promise<void> => {
  await axiosClient.delete(`/employees/${id}`);
};
