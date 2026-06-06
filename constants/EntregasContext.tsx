import React, { createContext, useContext, useEffect, useState } from 'react';
import { getEntregas, confirmarEntregaFirestore, seedEntregasIfEmpty } from './firestoreService';
import { ENTREGAS_MOCK, Entrega } from './entregas'; // fallback local

type EntregasContextType = {
  entregas: Entrega[];
  loading: boolean;
  confirmarEntrega: (id: string) => void;
  recarregarEntregas: () => Promise<void>;
};

const EntregasContext = createContext<EntregasContextType>({
  entregas: ENTREGAS_MOCK,
  loading: false,
  confirmarEntrega: () => {},
  recarregarEntregas: async () => {},
});

export function EntregasProvider({ children }: { children: React.ReactNode }) {
  const [entregas, setEntregas] = useState<Entrega[]>(ENTREGAS_MOCK);
  const [loading, setLoading] = useState(true);

  const carregarEntregas = async () => {
    try {
      // Garante que o Firestore tenha os dados iniciais
      await seedEntregasIfEmpty();
      const dados = await getEntregas();
      if (dados.length > 0) {
        setEntregas(dados as Entrega[]);
      } else {
        // Fallback para mock local se Firestore estiver vazio/sem conexão
        setEntregas(ENTREGAS_MOCK);
      }
    } catch (error) {
      console.error('Erro ao carregar entregas do Firestore, usando mock local:', error);
      setEntregas(ENTREGAS_MOCK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEntregas();
  }, []);

  const confirmarEntrega = async (id: string) => {
    const agora = new Date();
    const hora = agora.getHours().toString().padStart(2, '0');
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    const eta = `${hora}:${minutos}`;

    // Atualiza local imediatamente (optimistic update)
    setEntregas((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'entregue' as const, eta } : e
      )
    );

    // Persiste no Firestore
    try {
      await confirmarEntregaFirestore(id, eta);
    } catch (error) {
      console.error('Erro ao confirmar entrega no Firestore:', error);
      // Se falhar, reverte o estado local
      setEntregas((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: 'transito' as const } : e
        )
      );
    }
  };

  return (
    <EntregasContext.Provider value={{ entregas, loading, confirmarEntrega, recarregarEntregas: carregarEntregas }}>
      {children}
    </EntregasContext.Provider>
  );
}

export const useEntregas = () => useContext(EntregasContext);
