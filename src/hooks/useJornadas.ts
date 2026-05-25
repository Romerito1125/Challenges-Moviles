import { useState } from 'react';
import {
  getJornadasByEmpleado,
  getResumenExtrasEmpleado,
  createJornada,
  updateJornada,
  deleteJornada,
  Jornada,
  ResumenExtras,
  CreateJornadaDto,
  UpdateJornadaDto,
} from '../api/jornadaService';

const useJornadas = () => {
  const [jornadas, setJornadas]   = useState<Jornada[]>([]);
  const [resumen, setResumen]     = useState<ResumenExtras | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const fetchByEmpleado = async (idEmpleado: string | number) => {
    setIsPending(true);
    setError(null);
    try {
      const data = await getJornadasByEmpleado(idEmpleado);
      setJornadas(data);
      // El resumen es independiente — si falla no bloquea las jornadas
      getResumenExtrasEmpleado(idEmpleado)
        .then(setResumen)
        .catch(() => {});
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return [];
    } finally {
      setIsPending(false);
    }
  };

  const add = async (dto: CreateJornadaDto) => {
    setIsPending(true);
    setError(null);
    try {
      const created = await createJornada(dto);
      setJornadas((prev) => [created, ...prev]);
      // Refresca el resumen histórico tras añadir una jornada
      getResumenExtrasEmpleado(dto.id_empleado).then(setResumen);
      return created;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return null;
    } finally {
      setIsPending(false);
    }
  };

  const update = async (id: string | number, dto: UpdateJornadaDto, idEmpleado?: string | number) => {
    setIsPending(true);
    setError(null);
    try {
      const updated = await updateJornada(id, dto);
      setJornadas((prev) => prev.map((j) => (j.id === id ? updated : j)));
      // Refresca el resumen si se conoce el empleado
      if (idEmpleado) getResumenExtrasEmpleado(idEmpleado).then(setResumen);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return null;
    } finally {
      setIsPending(false);
    }
  };

  const remove = async (id: string | number, idEmpleado?: string | number) => {
    setIsPending(true);
    setError(null);
    try {
      await deleteJornada(id);
      setJornadas((prev) => prev.filter((j) => j.id !== id));
      // Refresca el resumen si se conoce el empleado
      if (idEmpleado) getResumenExtrasEmpleado(idEmpleado).then(setResumen);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message ?? err.message);
      return false;
    } finally {
      setIsPending(false);
    }
  };

  return { jornadas, resumen, isPending, error, fetchByEmpleado, add, update, remove };
};

export default useJornadas;
