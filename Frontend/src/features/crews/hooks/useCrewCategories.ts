import { useState, useEffect } from "react";
import type { CrewCategory } from "../types/crew";
import { getCrews } from "@/api/crewApi";

export function useCrewCategories() {
  const [categories, setCategories] = useState<CrewCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAndGroupCrews = async () => {
      try {
        const allCrews = await getCrews();

        const recreativoCount = allCrews.filter((c) => c.level === 0).length;
        const competenciaCount = allCrews.filter((c) => c.level === 1).length;
        const eliteCount = allCrews.filter((c) => c.level === 2).length;

        const realData: CrewCategory[] = [
          { id: 0, name: "Recreativo", groupCount: recreativoCount, type: "main" },
          { id: 1, name: "Competencia", groupCount: competenciaCount, type: "main" },
          { id: 2, name: "Elite", groupCount: eliteCount, type: "main" },
        ];

        if (isMounted) setCategories(realData);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error al cargar las crews.";
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAndGroupCrews();

    return () => {
      isMounted = false;
    };
  }, []);

  return { categories, isLoading, error };
}