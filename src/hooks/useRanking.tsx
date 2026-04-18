import { useEffect, useState } from "react";
import useCollection from "./useCollection";

const useRanking = () => {
  const { getAll } = useCollection("reto");
  const [ranking, setRanking] = useState<any[]>([]);

  useEffect(() => {
    const loadRanking = async () => {
      const data = await getAll();

      const ordenado = data.sort((a: any, b: any) => b.puntos - a.puntos);

      setRanking(ordenado);
    };

    loadRanking();
  }, []);

  return { ranking };
};

export default useRanking;