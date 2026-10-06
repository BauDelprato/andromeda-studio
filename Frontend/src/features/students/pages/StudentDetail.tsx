import { Link, useParams } from "react-router-dom";
import { useStudentDetail } from "@/features/students/hooks/useStudentDetail";
import StudentProfile from "../components/StudentProfile";
import styles from "./StudentDetail.module.css";

function StudentDetail() {
  const { id } = useParams();
  const { student, isLoading, error } = useStudentDetail(id);

  if (isLoading) {
    return (
      <section className={styles.state}>
        <p>Cargando información del alumno...</p>
      </section>
    );
  }

  if (error || !student) {
    return (
      <section className={styles.state}>
        <p>{error ?? "No se encontró el alumno solicitado."}</p>
        <Link className={styles.stateBackLink} to="/students">Volver a alumnos</Link>
      </section>
    );
  }

  return (
    <section className={styles.screen}>
      <div className={styles.content}>
        <Link className={styles.backLink} to="/students">← Volver a alumnos</Link>
        <StudentProfile student={student} />
      </div>
    </section>
  );
}

export default StudentDetail;
