import { useParams } from "react-router-dom";
import { useStudentDetail } from "@/features/students/hooks/useStudentDetail";
import { EditStudentForm } from "../components/EditStudentForm";
import { updateStudentApi, changeStudentStatusApi } from "@/api/studentApi"; 
import type { EditStudentFormData } from "@/features/students/types/studentFormTypes";
import styles from "./EditStudentPage.module.css";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);
  
  const isValidId = id !== undefined && Number.isInteger(studentId) && studentId > 0;
  const { student, isLoading, error } = useStudentDetail(id || "");
  const handleSaveStudent = async (formData: EditStudentFormData) => {
    if (!student) return;
    
    await updateStudentApi(student.id, formData);
    if (student.isActive !== formData.isActive) {
      await changeStudentStatusApi(student.id, formData.isActive);
    }
  };

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
        <EditStudentForm student={student} onSubmit={handleSaveStudent} />
      </div>
    </section>
  );
}