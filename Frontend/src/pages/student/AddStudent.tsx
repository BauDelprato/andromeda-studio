import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LuCalendar } from "react-icons/lu";
import { SegmentedToggle } from "@/components/ui/toggle/SegmentedToggle";
import { StatusPill } from "@/components/ui/badge/StatusPill";
import type {
  StudentFormValues,
  FitnessCertificateStatus,
} from "@/types/student/studentForm";
import styles from "./AddStudent.module.css";

export interface AddStudentProps {
  initialValues?: Partial<StudentFormValues>;
  onSubmit?: (values: StudentFormValues) => void | Promise<void>;
  isLoading?: boolean;
  serverError?: string | null;
}

const DEFAULT_FORM_VALUES: StudentFormValues = {
  fullName: "",
  dni: "",
  email: "",
  phone: "",
  birthDate: "",
  emergencyPhone: "",
  guardian: "",
  fitnessStatus: "vigente",
  fitnessExpirationDate: "",
  hasHealthInsurance: true,
  healthInsurance: "",
  notes: "",
  canCompete: true,
  hasLiabilityWaiver: true,
};

export function AddStudent({
  initialValues,
  onSubmit,
  isLoading = false,
  serverError = null,
}: AddStudentProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState<StudentFormValues>({
    ...DEFAULT_FORM_VALUES,
    ...initialValues,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFieldChange = <K extends keyof StudentFormValues>(
    field: K,
    value: StudentFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCycleFitnessStatus = () => {
    const cycleMap: Record<FitnessCertificateStatus, FitnessCertificateStatus> = {
      vigente: "pendiente",
      pendiente: "vencido",
      vencido: "vigente",
    };
    handleFieldChange("fitnessStatus", cycleMap[form.fitnessStatus]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (onSubmit) {
      await onSubmit(form);
    } else {
      // Navegación por defecto tras guardar exitosamente
      console.log("Guardar alumno (preparado para API):", form);
      navigate("/students");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Mensajes de error */}
          {(validationError || serverError) && (
            <div className={styles.errorAlert} role="alert">
              {validationError || serverError}
            </div>
          )}

          {/* 1. Datos personales */}
          <section className={styles.section} aria-labelledby="heading-datos-personales">
            <h2 id="heading-datos-personales" className={styles.sectionTitle}>
              Datos personales
            </h2>

            <div className={styles.gridThree}>
              <div className={styles.field}>
                <label htmlFor="fullName" className={styles.label}>
                  Nombre y Apellido
                </label>
                <input
                  id="fullName"
                  type="text"
                  className={styles.input}
                  value={form.fullName}
                  onChange={(e) => handleFieldChange("fullName", e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="dni" className={styles.label}>
                  DNI
                </label>
                <input
                  id="dni"
                  type="text"
                  className={styles.input}
                  value={form.dni}
                  onChange={(e) => handleFieldChange("dni", e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  value={form.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.gridTwo}>
              <div className={styles.field}>
                <label htmlFor="phone" className={styles.label}>
                  Teléfono
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={styles.input}
                  value={form.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="birthDate" className={styles.label}>
                  Fecha de nacimiento
                  <LuCalendar size={15} className={styles.labelIcon} aria-hidden="true" />
                </label>
                <input
                  id="birthDate"
                  type="text"
                  className={styles.input}
                  value={form.birthDate}
                  onChange={(e) => handleFieldChange("birthDate", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* 2. Responsables */}
          <section className={styles.section} aria-labelledby="heading-responsables">
            <h2 id="heading-responsables" className={styles.sectionTitle}>
              Responsables
            </h2>

            <div className={styles.gridTwo}>
              <div className={styles.field}>
                <label htmlFor="emergencyPhone" className={styles.label}>
                  Teléfono de emergencias
                </label>
                <input
                  id="emergencyPhone"
                  type="tel"
                  className={styles.input}
                  value={form.emergencyPhone}
                  onChange={(e) => handleFieldChange("emergencyPhone", e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="guardian" className={styles.label}>
                  Responsable
                </label>
                <input
                  id="guardian"
                  type="text"
                  className={styles.input}
                  value={form.guardian}
                  onChange={(e) => handleFieldChange("guardian", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* 3. Salud */}
          <section className={styles.section} aria-labelledby="heading-salud">
            <h2 id="heading-salud" className={styles.sectionTitle}>
              Salud
            </h2>

            {/* Fila 1: Apto físico + Fecha de vencimiento */}
            <div className={styles.saludRow}>
              <div className={styles.inlineField}>
                <span className={styles.label}>Apto físico</span>
                <StatusPill
                  status={form.fitnessStatus}
                  onClick={handleCycleFitnessStatus}
                />
              </div>

              <div className={styles.underlineField}>
                <label htmlFor="fitnessExpirationDate" className={styles.label}>
                  Fecha de vencimiento
                  <LuCalendar size={15} className={styles.labelIcon} aria-hidden="true" />
                </label>
                <input
                  id="fitnessExpirationDate"
                  type="text"
                  placeholder="Fecha"
                  className={styles.underlineInput}
                  value={form.fitnessExpirationDate}
                  onChange={(e) => handleFieldChange("fitnessExpirationDate", e.target.value)}
                />
              </div>
            </div>

            {/* Fila 2: Obra social? + Obra social nombre */}
            <div className={styles.saludRow}>
              <div className={styles.inlineField}>
                <span className={styles.label}>Obra social?</span>
                <SegmentedToggle
                  value={form.hasHealthInsurance}
                  onChange={(val) => handleFieldChange("hasHealthInsurance", val)}
                  ariaLabel="Tiene obra social"
                />
              </div>

              <div className={styles.underlineField}>
                <label htmlFor="healthInsurance" className={styles.label}>
                  Obra social
                </label>
                <input
                  id="healthInsurance"
                  type="text"
                  placeholder="OS"
                  className={styles.underlineInput}
                  value={form.healthInsurance}
                  disabled={!form.hasHealthInsurance}
                  onChange={(e) => handleFieldChange("healthInsurance", e.target.value)}
                />
              </div>
            </div>

            {/* Fila 3: Aclaraciones */}
            <div className={styles.field}>
              <label htmlFor="notes" className={styles.label}>
                Aclaraciones
              </label>
              <textarea
                id="notes"
                className={styles.textarea}
                placeholder="Acá van las Condiciones especiales, etc"
                value={form.notes}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
              />
            </div>
          </section>

          {/* 4. Competencias */}
          <section className={styles.section} aria-labelledby="heading-competencias">
            <h2 id="heading-competencias" className={styles.sectionTitle}>
              Competencias
            </h2>

            <div className={styles.competenciasRow}>
              <div className={styles.inlineField}>
                <span className={styles.label}>Apto para competir?</span>
                <SegmentedToggle
                  value={form.canCompete}
                  onChange={(val) => handleFieldChange("canCompete", val)}
                  ariaLabel="Apto para competir"
                />
              </div>

              <div className={styles.inlineField}>
                <span className={styles.label}>Despliegue de responsabilidades?</span>
                <SegmentedToggle
                  value={form.hasLiabilityWaiver}
                  onChange={(val) => handleFieldChange("hasLiabilityWaiver", val)}
                  ariaLabel="Despliegue de responsabilidades"
                />
              </div>
            </div>
          </section>

          {/* Botón de acción: Guardar */}
          <div className={styles.actions}>
            <button
              type="submit"
              disabled={isLoading}
              className={styles.submitBtn}
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
