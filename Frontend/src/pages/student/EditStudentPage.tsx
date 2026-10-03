import { useParams } from "react-router-dom";
import { useStudentDetail } from "@/hooks/student/useStudentDetail";
import { EditStudentForm } from "./components/EditStudentForm";
import styles from "./EditStudentPage.module.css";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const { student, isLoading, error } = useStudentDetail(id!);

  if (isLoading) return <div style={{ padding: "40px", textAlign: "center" }}>Cargando datos del alumno...</div>;
  if (error || !student) return <div style={{ padding: "40px", textAlign: "center", color: "red" }}>Error al cargar el alumno.</div>;

  return (
    <section className={styles.screen}>
      <div className={styles.content}>
        <EditStudentForm student={student} />
      </div>
    </section>
  );
}