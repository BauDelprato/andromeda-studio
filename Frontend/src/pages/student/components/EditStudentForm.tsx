import type { Student } from "@/types/student/student";
import { useEditStudentForm } from "@/hooks/student/useEditStudentForm";
import styles from "./EditStudentForm.module.css";

interface EditStudentFormProps {
  student: Student;
}

export function EditStudentForm({ student }: EditStudentFormProps) {
  const { form, updateField, handleSubmit, handleToggleStatus, isUpdating, error, success } = useEditStudentForm(student);

  return (
    <>
      {success && <div className={styles.successAlert}>Alumno actualizado correctamente.</div>}
      {error && <div className={styles.errorAlert}>{error}</div>}

      <form className={styles.card} onSubmit={handleSubmit}>
        
        <header className={styles.profileHeader}>
          <div className={styles.identity}>
            <div className={styles.avatar}>
              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
            </div>
            <div>
              <h1>
                {student.firstName} {student.lastName}
                <span className={`${styles.badge} ${!student.isActive ? styles.badgeInactive : ''}`}>
                  {student.isActive ? "Activo" : "Inactivo"}
                </span>
              </h1>
            </div>
          </div>
          <button 
            type="button" 
            className={student.isActive ? styles.deactivateButton : styles.activateButton} 
            onClick={handleToggleStatus}
            disabled={isUpdating}
          >
            {student.isActive ? "Dar de baja" : "Activar alumno"}
          </button>
        </header>

        <section className={styles.section}>
          <h2 className={styles.heading}>Datos personales</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="firstName">Nombre</label>
              <input className={styles.input} id="firstName" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="lastName">Apellido</label>
              <input className={styles.input} id="lastName" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="dni">DNI</label>
              <input className={styles.input} id="dni" value={form.dni} onChange={(e) => updateField("dni", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Correo</label>
              <input className={styles.input} id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">Teléfono</label>
              <input className={styles.input} id="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Salud y Aclaraciones</h2>
          <div className={styles.grid}>
            <label className={styles.checkboxContainer}>
              <input type="checkbox" checked={form.fitnessCertificate} onChange={(e) => updateField("fitnessCertificate", e.target.checked)} />
              Apto físico al día
            </label>
            <div className={styles.field} style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label} htmlFor="notes">Aclaraciones</label>
              <textarea className={styles.textarea} id="notes" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <button className={styles.saveButton} type="submit" disabled={isUpdating}>
            {isUpdating ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </>
  );
}