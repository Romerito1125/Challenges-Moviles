import { useState, useCallback } from 'react';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  Employee,
} from '../api/employeeService';

const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsPending(true);
    setError(null);
    try {
      const data = await getEmployees();
      setEmployees(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return [];
    } finally {
      setIsPending(false);
    }
  }, []);

  const fetchById = useCallback(async (id: string | number) => {
    setIsPending(true);
    setError(null);
    try {
      const data = await getEmployeeById(id);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return null;
    } finally {
      setIsPending(false);
    }
  }, []);

  const add = useCallback(
    async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      setIsPending(true);
      setError(null);
      try {
        const created = await createEmployee(employee);
        setEmployees((prev) => [...prev, created]);
        return created;
      } catch (err: any) {
        setError(err.response?.data?.message ?? err.message);
        return null;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  const update = useCallback(
    async (
      id: string | number,
      updates: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>
    ) => {
      setIsPending(true);
      setError(null);
      try {
        const updated = await updateEmployee(id, updates);
        setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
        return updated;
      } catch (err: any) {
        setError(err.response?.data?.message ?? err.message);
        return null;
      } finally {
        setIsPending(false);
      }
    },
    []
  );

  const remove = useCallback(async (id: string | number) => {
    setIsPending(true);
    setError(null);
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return false;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { employees, isPending, error, fetchAll, fetchById, add, update, remove };
};

export default useEmployees;
