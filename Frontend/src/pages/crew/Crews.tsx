import { useEffect, useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { apiFetch } from "@/api/client";
import styles from "./Crews.module.css";

interface CrewItem {
  id: number;
  name: string;
  category?: string;
}

const DEFAULT_CREWS: CrewItem[] = [
  { id: 1, name: "Maneuver", category: "Premium" },
  { id: 2, name: "Babymakers", category: "Estándar" },
  { id: 3, name: "Killa", category: "Principiante" },
  { id: 4, name: "Nova" },
  { id: 5, name: "Academy" },
  { id: 6, name: "Chicas plásticas" },
];

function Crews() {
  const [crews, setCrews] = useState<CrewItem[]>(DEFAULT_CREWS);

  useEffect(() => {
    // Attempt to fetch from backend if available, otherwise retain defaults
    apiFetch<CrewItem[]>("/api/Crews")
      .then((data) => {
        if (data && data.length > 0) {
          setCrews(data);
        }
      })
      .catch(() => {
        // Keep default crews if backend not reachable
      });
  }, []);

  return (
    <div className={styles.container}>
      {/* 2-column Grid of Crew cards */}
      <div className={styles.crewsGrid}>
        {crews.map((crew) => (
          <div
            key={crew.id || crew.name}
            className={styles.crewCard}
            onClick={() => console.log("Crew seleccionado:", crew.name)}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.crewName}>{crew.name}</h3>
              <LuArrowUpRight size={20} className={styles.arrowIcon} />
            </div>

            {crew.category && (
              <span className={styles.crewCategory}>{crew.category}</span>
            )}
          </div>
        ))}
      </div>

      {/* Right Side Panel: Cupos y tarifas */}
      <aside className={styles.sidePanel}>
        <h4 className={styles.sidePanelTitle}>Cupos y tarifas</h4>

        <button
          type="button"
          className={styles.panelBtn}
          onClick={() => console.log("Modificar cupos")}
        >
          Modificar cupos
        </button>

        <button
          type="button"
          className={styles.panelBtn}
          onClick={() => console.log("Modificar tarifas")}
        >
          Modificar tarifas
        </button>
      </aside>
    </div>
  );
}

export default Crews;
