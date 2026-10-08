import { useStudentForm } from "@/features/students/hooks/useStudentForm";
import styles from "./StudentForm.module.css";

export function StudentForm() {
  const { form, updateField, handleSubmit, isLoading, error, success } = useStudentForm();

  return (
    <div className={styles.formContainer}>
      {success && <div className={styles.successAlert}>Alumno guardado correctamente en la base de datos.</div>}
      {error && <div className={styles.errorAlert}>{error}</div>}

      <form className={styles.card} onSubmit={handleSubmit}>
        
        <section className={styles.section}>
          <h2 className={styles.heading}>Datos Personales</h2>
          <div className={styles.personalGrid}>
            
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
          <div className={styles.healthGrid}>
            
            <label className={styles.checkboxContainer}>
              <input type="checkbox" checked={form.fitnessCertificate} onChange={(e) => updateField("fitnessCertificate", e.target.checked)} />
              Apto físico al día
            </label>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="notes">Aclaraciones</label>
              <textarea className={styles.textarea} id="notes" placeholder="Condiciones especiales, etc." value={form.notes} onChange={(e) => updateField("notes", e.target.value)} />
            </div>

          </div>
        </section>

        <div className={styles.actions}>
          <button className={styles.saveButton} type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}