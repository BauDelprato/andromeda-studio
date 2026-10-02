import { useState, type ChangeEvent, type FormEvent } from "react";
import FormInput from "./components/FormInput";
import ToggleGroup from "./components/ToggleGroup";
import type { StudentFormData } from "./studentFormTypes";
import styles from "./AddStudentPage.module.css";
import { useCreateStudent } from "../../hooks/useCreateStudent";

const emptyForm: StudentFormData = {
  fullName: "", dni: "", email: "", phone: "", birthDate: "",
  emergencyPhone: "", guardian: "", physicalExamExpiration: "",
  hasHealthInsurance: null, healthInsurance: "", healthNotes: "",
  canCompete: null, acceptsResponsibilities: null,
};

export default function AddStudentPage() {
  const [form, setForm] = useState<StudentFormData>(emptyForm);
  const { submitStudent, isLoading, error, success } = useCreateStudent();

  const updateField = <K extends keyof StudentFormData>(field: K, value: StudentFormData[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateField("healthNotes", event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.fullName || !form.dni || !form.email) {
        alert("Por favor completa Nombre, DNI y Correo.");
        return;
    }
    await submitStudent(form);
  };

  return (
    <main className={styles.screen}>
      {success && <div style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>Estudiante guardado exitosamente.</div>}
      {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>Error: {error}</div>}

      <form className={styles.card} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h1 className={styles.heading}>Datos personales</h1>
          <div className={styles.personalGrid}>
            <FormInput id="fullName" label="Nombre y Apellido" value={form.fullName} onChange={(value) => updateField("fullName", value)} />
            <FormInput id="dni" label="DNI" value={form.dni} onChange={(value) => updateField("dni", value)} />
            <FormInput id="email" label="Correo" type="email" value={form.email} onChange={(value) => updateField("email", value)} />
            <FormInput id="phone" label="Teléfono" type="tel" value={form.phone} onChange={(value) => updateField("phone", value)} />
            <FormInput id="birthDate" label="Fecha de nacimiento" type="date" value={form.birthDate} onChange={(value) => updateField("birthDate", value)} />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Responsables</h2>
          <div className={styles.responsibleGrid}>
            <FormInput id="emergencyPhone" label="Teléfono de emergencias" type="tel" value={form.emergencyPhone} onChange={(value) => updateField("emergencyPhone", value)} />
            <FormInput id="guardian" label="Responsable" value={form.guardian} onChange={(value) => updateField("guardian", value)} />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Salud</h2>
          <div className={styles.healthGrid}>
            <div className={styles.physicalStatus}>
              <span>Apto físico</span>
              <span className={styles.badge}>Vigente</span>
            </div>
            <FormInput id="physicalExamExpiration" label="Fecha de vencimiento" type="date" value={form.physicalExamExpiration} onChange={(value) => updateField("physicalExamExpiration", value)} />
            <ToggleGroup label="¿Obra social?" value={form.hasHealthInsurance} onChange={(value) => updateField("hasHealthInsurance", value)} />
            <FormInput id="healthInsurance" label="Obra social" value={form.healthInsurance} onChange={(value) => updateField("healthInsurance", value)} />
            <div className={styles.notesField}>
              <label className={styles.fieldLabel} htmlFor="healthNotes">Aclaraciones</label>
              <textarea className={styles.textarea} id="healthNotes" placeholder="Acá van las Condiciones especiales, etc" value={form.healthNotes} onChange={handleNotesChange} rows={3} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Competencias</h2>
          <div className={styles.competenciesGrid}>
            <ToggleGroup label="¿Apto para competir?" value={form.canCompete} onChange={(value) => updateField("canCompete", value)} />
            <ToggleGroup label="¿Despliegue de responsabilidades?" value={form.acceptsResponsibilities} onChange={(value) => updateField("acceptsResponsibilities", value)} />
          </div>
        </section>

        <div className={styles.actions}>
          <button className={styles.saveButton} type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </main>
  );
}