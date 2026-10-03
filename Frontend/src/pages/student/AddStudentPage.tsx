import { StudentForm } from "./components/StudentForm";
import styles from "./AddStudentPage.module.css";

export default function AddStudentPage() {
  return (
    <section className={styles.screen}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h2>Añadir Alumno</h2>
          <p>Registra un nuevo alumno completando sus datos correspondientes.</p>
        </header>

        <StudentForm />
      </div>
    </section>
  );
}