import type { Student } from "@/features/students/types/student";
import DisplayField from "@/components/displayfield/DisplayField";
import StatusBadge from "@/components/statusbadge/StatusBadge";
import { studentDetailDateFormatter } from "@/features/students/constants/studentDetail";
import { useNavigate } from "react-router-dom";
import styles from "./StudentProfile.module.css";

interface StudentProfileProps {
  student: Student;
}

function StudentProfile({ student }: StudentProfileProps) {
  const navigate = useNavigate();

  return (
    <article className={styles.profile}>
      <header className={styles.profileHeader}>
        <div className={styles.identity}>
          <div className={styles.avatar} aria-hidden="true">
            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
          </div>
          <div>
            <h1>{student.firstName} {student.lastName}</h1>
            <StatusBadge variant={student.isActive ? "positive" : "negative"}>
              {student.isActive ? "Activo" : "Inactivo"}
            </StatusBadge>
          </div>
        </div>
        
        {}
        <div className={styles.headerRight}>
          <button 
            className={styles.editButton}
            onClick={() => navigate(`/students/${student.id}/edit`)}
          >
            Editar perfil
          </button>
          <span className={styles.studentNumber}>Alumno #{student.id}</span>
        </div>
      </header>

      <section className={styles.section}>
        <h2>Datos personales</h2>
        <div className={styles.detailsGrid}>
          <DisplayField label="DNI" value={student.dni} />
          <DisplayField label="Teléfono" value={student.phone} />
          <DisplayField label="Correo" value={student.email} />
          <DisplayField label="Fecha de alta" value={studentDetailDateFormatter.format(new Date(student.createdAt))} />
        </div>
      </section>

      <section className={styles.notes}>
        <h2>Aclaraciones</h2>
        <p>{student.notes?.trim() || "Sin aclaraciones registradas."}</p>
      </section>

      <section className={styles.section}>
        <h2>Competencias</h2>
        <div className={styles.competency}>
          <span>Certificado físico</span>
          <span className={`${styles.answer} ${student.fitnessCertificate ? styles.answerYes : styles.answerNo}`}>
            {student.fitnessCertificate ? "Presentado" : "Pendiente"}
          </span>
        </div>
      </section>
    </article>
  );
}

export default StudentProfile;