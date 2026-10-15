import { useState, useRef, useEffect } from "react";
import type { Student } from "@/features/students/types/student";
import styles from "./StudentSearchSelect.module.css";

interface Props {
  students: Student[];
  selectedStudent: Student | null;
  onSelect: (student: Student) => void;
}

export function StudentSearchSelect({ students, selectedStudent, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredStudents = students.filter((s) => {
    const full = `${s.firstName} ${s.lastName}`.toLowerCase();
    return full.includes(searchTerm.toLowerCase()) || s.dni.includes(searchTerm);
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName} (${selectedStudent.dni})` : searchTerm;

  return (
    <div className={styles.container} ref={containerRef}>
      <input
        type="text"
        className={styles.input}
        placeholder="Escribe nombre o DNI del alumno..."
        value={isOpen ? searchTerm : displayValue}
        onClick={() => setIsOpen(true)}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
      />
      {isOpen && (
        <ul className={styles.dropdown}>
          {filteredStudents.length === 0 ? (
            <li className={styles.option}>No se encontraron alumnos</li>
          ) : (
            filteredStudents.map((s) => (
              <li 
                key={s.id} 
                className={styles.option}
                onClick={() => {
                  onSelect(s);
                  setSearchTerm("");
                  setIsOpen(false);
                }}
              >
                {s.firstName} {s.lastName} - DNI: {s.dni}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}