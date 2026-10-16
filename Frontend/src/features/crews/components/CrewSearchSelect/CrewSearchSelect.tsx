import { useState, useRef, useEffect } from "react";
import type { Crew } from "../../types/crew";
import styles from "./CrewSearchSelect.module.css";

interface Props {
  crews: Crew[];
  selectedCrew: Crew | null;
  onSelect: (crew: Crew) => void;
}

export function CrewSearchSelect({ crews, selectedCrew, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredCrews = crews.filter((c) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      <input
        type="text"
        className={styles.input}
        placeholder="Buscar crew..."
        value={isOpen ? searchTerm : (selectedCrew?.name || "")}
        onClick={() => setIsOpen(true)}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
      />
      {isOpen && (
        <ul className={styles.dropdown}>
          {filteredCrews.length === 0 ? (
            <li className={styles.option}>No se encontraron crews</li>
          ) : (
            filteredCrews.map((crew) => (
              <li 
                key={crew.id} 
                className={styles.option}
                onClick={() => {
                  onSelect(crew);
                  setSearchTerm("");
                  setIsOpen(false);
                }}
              >
                {crew.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}