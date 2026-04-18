import { createContext, useContext, useEffect, useState } from "react";
import useCollection from "../hooks/useCollection";
import { AuthContext } from "./AuthContext";

const MisionesContext = createContext<any>(null);

const misionesIniciales = [
  { id: 1, nombre: "Tomar foto", completado: false, puntos: 50 },
  { id: 2, nombre: "Moverse 30m", completado: false, puntos: 100 },
  { id: 3, nombre: "Esperar 10s quieto", completado: false, puntos: 150 },
];

export const MissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [misiones, setMisiones] = useState<any[]>(misionesIniciales);
  const [puntos, setPuntos] = useState(0);

  const { user } = useContext(AuthContext);
  const { getAll, add, update } = useCollection("reto");

  const [docId, setDocId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      const data = await getAll([["uid", "==", user.uid]]);

      if (data.length > 0) {
        const juego = data[0] as any;

        setDocId(juego.id);

        const misionesRecuperadas = (juego.misiones || []).map((m: any) => {
          const base = misionesIniciales.find(x => x.id === m.id);

          return {
            id: m.id,
            nombre: base?.nombre,
            puntos: base?.puntos,
            completado: m.completado
          };
        });

        setMisiones(
          misionesRecuperadas.length > 0 ? misionesRecuperadas : misionesIniciales
        );

        setPuntos(juego.puntos || 0);
      } else {
        const ref = await add({
          uid: user.uid,
          puntos: 0,
          misiones: misionesIniciales.map(m => ({
            id: m.id,
            completado: false
          }))
        });

        if (ref) setDocId(ref.id);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    localStorage.setItem("juego", JSON.stringify({ misiones, puntos }));

    const save = async () => {
      if (!docId) return;

      await update(docId, {
        puntos: puntos,
        misiones: misiones.map(m => ({
          id: m.id,
          completado: m.completado
        }))
      });
    };

    save();
  }, [misiones, puntos, docId]);

  const completarMision = (id: number) => {
    const mision = misiones.find((m) => m.id === id);

    if (!mision || mision.completado) return;

    setMisiones((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, completado: true } : m
      )
    );

    setPuntos((prev) => prev + mision.puntos);
  };

  return (
    <MisionesContext.Provider value={{ misiones, puntos, completarMision }}>
      {children}
    </MisionesContext.Provider>
  );
};

export const useMissions = () => useContext(MisionesContext);