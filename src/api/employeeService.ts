import axiosClient from './axiosClient';

export interface Employee {
  id?: string | number;
  cedula: string;
  nombre: string;
  apellido: string;
  salario: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// GET /api/employees
export const getEmployees = async (): Promise<Employee[]> => {
  const { data } = await axiosClient.get<ApiResponse<Employee[]>>('/employees');
  return data.data ?? [];
};

// GET /api/employees/:id
export const getEmployeeById = async (id: string | number): Promise<Employee> => {
  const { data } = await axiosClient.get<ApiResponse<Employee>>(`/employees/${id}`);
  return data.data!;
};

// POST /api/employees
export const createEmployee = async (
  employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>
): Promise<Employee> => {
  const { data } = await axiosClient.post<ApiResponse<Employee>>('/employees', employee);
  return data.data!;
};

// PUT /api/employees/:id
export const updateEmployee = async (
  id: string | number,
  updates: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>
): Promise<Employee> => {
  const { data } = await axiosClient.put<ApiResponse<Employee>>(`/employees/${id}`, updates);
  return data.data!;
};

// DELETE /api/employees/:id
export const deleteEmployee = async (id: string | number): Promise<void> => {
  await axiosClient.delete(`/employees/${id}`);
};
