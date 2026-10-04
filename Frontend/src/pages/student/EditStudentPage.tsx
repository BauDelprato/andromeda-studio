import { useParams } from "react-router-dom";
import { useStudentDetail } from "@/hooks/student/useStudentDetail";
import { EditStudentForm } from "./components/EditStudentForm";
import styles from "./EditStudentPage.module.css";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  
  const { student, isLoading, error } = useStudentDetail(id || "");

  const studentId = Number(id);
  const isValidId = id && Number.isInteger(studentId) && studentId > 0;

  if (!isValidId) {
    return (
      <section className={styles.screen}>
        <div className={styles.content}>
          <p className={styles.errorMessage}>El identificador del alumno no es válido.</p>
        </div>
      </section>
    );
  }

  if (isLoading) return <div className={styles.stateMessage}>Cargando datos del alumno...</div>;
  if (error || !student) return <div className={styles.errorMessage}>{error ?? "No se encontró el alumno."}</div>;

  return (
    <section className={styles.screen}>
      <div className={styles.content}>
        <EditStudentForm student={student} />
      </div>
    </section>
  );
}