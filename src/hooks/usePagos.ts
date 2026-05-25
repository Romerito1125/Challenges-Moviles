import { useState } from 'react';
import {
  getPagosByEmpleado,
  createPago,
  updatePago,
  deletePago,
  Pago,
  CreatePagoDto,
  UpdatePagoDto,
} from '../api/pagoService';

const usePagos = () => {
  const [pagos, setPagos]         = useState<Pago[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  /** Carga todos los pagos de un empleado */
  const fetchByEmpleado = async (idEmpleado: string | number) => {
    setIsPending(true);
    setError(null);
    try {
      const data = await getPagosByEmpleado(idEmpleado);
      setPagos(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return [];
    } finally {
      setIsPending(false);
    }
  };

  const add = async (dto: CreatePagoDto) => {
    setIsPending(true);
    setError(null);
    try {
      const created = await createPago(dto);
      setPagos((prev) => [...prev, created]);
      return created;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return null;
    } finally {
      setIsPending(false);
    }
  };

  const update = async (id: string | number, dto: UpdatePagoDto) => {
    setIsPending(true);
    setError(null);
    try {
      const updated = await updatePago(id, dto);
      setPagos((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return null;
    } finally {
      setIsPending(false);
    }
  };

  const remove = async (id: string | number) => {
    setIsPending(true);
    setError(null);
    try {
      await deletePago(id);
      setPagos((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { pagos, isPending, error, fetchByEmpleado, add, update, remove };
};

export default usePagos;
