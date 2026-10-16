import { useParams, useNavigate } from "react-router-dom";
import { getCrewMaxCapacity, CREW_LEVEL_NAMES } from "../types/crew";
import { useAddStudentToCrew } from "../hooks/useAddStudentToCrew";
import { StudentSearchSelect } from "../components/StudentSearchSelect/StudentSearchSelect";
import { Button } from "@/components/Button/Button";
import styles from "./AddStudentToCrewPage.module.css";

export default function AddStudentToCrewPage() {
  const { crewId } = useParams<{ crewId: string }>();
  const navigate = useNavigate();
  
  const { 
    crew, currentStudentsCount, allStudents, 
    selectedStudent, setSelectedStudent, 
    handleAddStudent, isSubmitting, successMsg, errorMsg, isLoading 
  } = useAddStudentToCrew(Number(crewId));

  if (isLoading) return <div className={styles.container}>Cargando datos...</div>;
  if (!crew) return <div className={`${styles.container} ${styles.fullText}`}>No se encontró la crew.</div>;

  const maxCapacity = getCrewMaxCapacity(crew.size);
  const isFull = currentStudentsCount >= maxCapacity;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Añadir Alumno</h1>
        <Button onClick={() => navigate(-1)} className={styles.backButton}>
          Volver
        </Button>
      </header>

      <div className={styles.infoCard}>
        <h2 className={styles.crewName}>{crew.name}</h2>
        <div className={styles.infoRow}>
          <p className={styles.infoText}>Nivel: <strong>{CREW_LEVEL_NAMES[crew.level]}</strong></p>
          <p className={isFull ? styles.fullText : styles.infoText}>
            Cupo: <strong>{currentStudentsCount} / {maxCapacity}</strong>
          </p>
        </div>
      </div>

      <div className={styles.formSection}>
        <label className={styles.label}>Seleccionar Alumno</label>
        <StudentSearchSelect 
          students={allStudents} 
          selectedStudent={selectedStudent} 
          onSelect={setSelectedStudent} 
        />
        <p className={styles.helperText}>
          *Solo aparecen alumnos que no están en esta crew.
        </p>
      </div>

      {successMsg && <div className={styles.successAlert}>{successMsg}</div>}
      {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

      <Button 
        onClick={handleAddStudent} 
        disabled={!selectedStudent || isSubmitting || isFull}
        className={styles.submitButton}
        style={{ opacity: (!selectedStudent || isFull) ? 0.5 : 1 }}
      >
        {isSubmitting ? "Agregando..." : isFull ? "La crew está llena" : "Vincular Alumno"}
      </Button>
    </div>
  );
}