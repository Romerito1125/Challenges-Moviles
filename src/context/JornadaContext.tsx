/**
 * JornadaContext
 * --------------
 * Provee el estado de la jornada a toda la app desde un único lugar.
 * Así cuando se navega entre pantallas el estado no se pierde ni recarga.
 */
import { createContext, useContext, ReactNode } from 'react';
import { useJornadaLocal, JornadaActiva, JornadaRegistro } from '../hooks/useJornadaLocal';

type JornadaContextType = ReturnType<typeof useJornadaLocal>;

const JornadaContext = createContext<JornadaContextType | null>(null);

export function JornadaProvider({ children }: { children: ReactNode }) {
  const value = useJornadaLocal();
  return (
    <JornadaContext.Provider value={value}>
      {children}
    </JornadaContext.Provider>
  );
}

export function useJornada(): JornadaContextType {
  const ctx = useContext(JornadaContext);
  if (!ctx) throw new Error('useJornada debe usarse dentro de <JornadaProvider>');
  return ctx;
}

// Re-exportar tipos para que los consumidores no importen del hook directamente
export type { JornadaActiva, JornadaRegistro };
