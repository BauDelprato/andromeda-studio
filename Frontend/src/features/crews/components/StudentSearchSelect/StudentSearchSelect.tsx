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
      <div className={styles.inputWrapper}>
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
        <svg 
          className={styles.searchIcon} 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" height="18" viewBox="0 0 24 24" 
          fill="none" stroke="currentColor" strokeWidth="2" 
          strokeLinecap="round" strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      
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