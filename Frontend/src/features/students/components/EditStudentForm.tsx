import type { Student } from "@/features/students/types/student";
import type { EditStudentFormData } from "@/features/students/types/studentFormTypes";
import { useEditStudentForm } from "@/features/students/hooks/useEditStudentForm";
import styles from "./EditStudentForm.module.css";

interface EditStudentFormProps {
  student: Student;
  onSubmit: (data: EditStudentFormData) => Promise<void>;
}

export function EditStudentForm({ student, onSubmit }: EditStudentFormProps) {
  const { form, updateField, handleSubmit, handleToggleStatus, isUpdating, error, success } = useEditStudentForm(student, onSubmit);

  return (
      <form className={styles.card} onSubmit={handleSubmit}>
        
        <header className={styles.profileHeader}>
          <div className={styles.identity}>
            <div className={styles.avatar}>
              {form.firstName.charAt(0)}{form.lastName.charAt(0)}
            </div>
            <div>
              <h1>
                {form.firstName} {form.lastName}
                <span className={`${styles.badge} ${!form.isActive ? styles.badgeInactive : ''}`}>
                  {form.isActive ? "Activo" : "Inactivo"}
                </span>
              </h1>
            </div>
          </div>
          <button 
            type="button" 
            className={form.isActive ? styles.deactivateButton : styles.activateButton} 
            onClick={handleToggleStatus}
            disabled={isUpdating}
          >
            {form.isActive ? "Dar de baja" : "Activar alumno"}
          </button>
        </header>

        <section className={styles.section}>
          <h2 className={styles.heading}>Datos personales</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="firstName">Nombre</label>
              <input className={styles.input} id="firstName" name="firstName" required value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="lastName">Apellido</label>
              <input className={styles.input} id="lastName" name="lastName" required value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="dni">DNI</label>
              <input className={styles.input} id="dni" name="dni" required value={form.dni} onChange={(e) => updateField("dni", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Correo</label>
              <input className={styles.input} id="email" name="email" type="email" required value={form.email} onChange={(e) => updateField("email", e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="phone">Teléfono</label>
              <input className={styles.input} id="phone" name="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
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
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label} htmlFor="notes">Aclaraciones</label>
              <textarea className={styles.textarea} id="notes" value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />
            </div>
          </div>
        </section>

          {success && <div className={styles.successAlert}>Alumno actualizado correctamente.</div>}
          {error && <div className={styles.errorAlert}>{error}</div>}


        <div className={styles.actions}>
          <button className={styles.saveButton} type="submit" disabled={isUpdating}>
            {isUpdating ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>

  );
}