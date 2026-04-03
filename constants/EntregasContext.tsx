import React, { createContext, useContext, useState } from 'react';
import { Entrega, ENTREGAS_MOCK } from './entregas';

type EntregasContextType = {
  entregas: Entrega[];
  confirmarEntrega: (id: string) => void;
};

const EntregasContext = createContext<EntregasContextType>({
  entregas: ENTREGAS_MOCK,
  confirmarEntrega: () => {},
});

export function EntregasProvider({ children }: { children: React.ReactNode }) {
  const [entregas, setEntregas] = useState<Entrega[]>(ENTREGAS_MOCK);

  const confirmarEntrega = (id: string) => {
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    setEntregas((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'entregue', eta: `${hora}:${minutos}` } : e
      )
    );
  };

  return (
    <EntregasContext.Provider value={{ entregas, confirmarEntrega }}>
      {children}
    </EntregasContext.Provider>
  );
}

export const useEntregas = () => useContext(EntregasContext);
