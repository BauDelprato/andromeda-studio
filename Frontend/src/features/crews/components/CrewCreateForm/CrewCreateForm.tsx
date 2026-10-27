import type { FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { AGE_OPTIONS } from "../../constants/crewAgeOptions";
import { LEVEL_OPTIONS } from "../../constants/crewLevelOptions";
import { SIZE_OPTIONS } from "../../constants/crewSizeOptions";
import type { CrewCreateFormValues } from "../../types/crew";
import styles from "./CrewCreateForm.module.css";

interface CrewCreateFormProps {
  values: CrewCreateFormValues;
  isSaving: boolean;
  error: string | null;
  saved: boolean;
  onFieldChange: <K extends keyof CrewCreateFormValues>(
    field: K,
    value: CrewCreateFormValues[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function CrewCreateForm({
  values,
  isSaving,
  error,
  saved,
  onFieldChange,
  onSubmit,
}: CrewCreateFormProps) {
  return (
    <section className={styles.editor} aria-labelledby="crew-create-form-title">
      <h2 className={styles.sectionTitle} id="crew-create-form-title">
        Datos de la Crew
      </h2>

      <form className={styles.form} onSubmit={onSubmit}>
        {error && (
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        )}

        {saved && (
          <p className={styles.successMessage} role="status">
            Crew creada correctamente.
          </p>
        )}

        <label className={`${styles.field} ${styles.nameField}`}>
          <span>Nombre de la Crew</span>
          <input
            autoComplete="off"
            className={styles.control}
            required
            value={values.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Nivel</span>
          <select
            className={styles.control}
            required
            value={values.level}
            onChange={(event) => {
              const selectedValue = event.target.value;
              const level = LEVEL_OPTIONS.find(
                (option) => option.value === Number(selectedValue),
              )?.value;
              onFieldChange("level", selectedValue === "" ? "" : level ?? "");
            }}
          >
            <option value="">Nivel</option>
            {LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Edad</span>
          <select
            className={styles.control}
            required
            value={values.age}
            onChange={(event) => {
              const selectedValue = event.target.value;
              onFieldChange("age", selectedValue === "" ? "" : Number(selectedValue));
            }}
          >
            <option value="">Edad</option>
            {AGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Tamaño</span>
          <select
            className={styles.control}
            required
            value={values.size}
            onChange={(event) => {
              const selectedValue = event.target.value;
              const size = SIZE_OPTIONS.find(
                (option) => option.value === Number(selectedValue),
              )?.value;
              onFieldChange("size", selectedValue === "" ? "" : size ?? "");
            }}
          >
            <option value="">Tamaño</option>
            {SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.actions}>
          <Button type="submit" className={styles.saveButton} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </section>
  );
}
