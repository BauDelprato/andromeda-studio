import type { FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import type { CrewFormData } from "@/features/crews/types/crew";
import { LEVEL_OPTIONS } from "@/features/crews/constants/crewLevelOptions";
import { AGE_OPTIONS } from "@/features/crews/constants/crewAgeOptions";
import { SIZE_OPTIONS } from "@/features/crews/constants/crewSizeOptions";
import styles from "./CrewEditForm.module.css";

interface CrewEditFormProps {
  values: CrewFormData;
  isSaving: boolean;
  error: string | null;
  saved: boolean;
  onFieldChange: <K extends keyof CrewFormData>(
    field: K,
    value: CrewFormData[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function CrewEditForm({
  values,
  isSaving,
  error,
  saved,
  onFieldChange,
  onSubmit,
}: CrewEditFormProps) {
  return (
    <section
      className={styles.editor}
      aria-labelledby="crew-edit-title"
    >
      <h2 className={styles.sectionTitle} id="crew-edit-title">
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
            Cambios guardados.
          </p>
        )}

        <label className={`${styles.field} ${styles.nameField}`}>
          <span>Nombre de la Crew</span>
          <input
            autoComplete="off"
            className={styles.control}
            required
            value={values.name}
            onChange={(event) =>
              onFieldChange("name", event.target.value)
            }
          />
        </label>

        <label className={styles.field}>
          <span>Nivel actual</span>
          <select
            className={styles.control}
            required
            value={values.level}
            onChange={(event) => {
              const level = LEVEL_OPTIONS.find(
                (option) => option.value === Number(event.target.value),
              )?.value;
              if (level !== undefined) onFieldChange("level", level);
            }}
          >
            {LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Edad actual</span>
          <select
            className={styles.control}
            required
            value={values.age}
            onChange={(event) =>
              onFieldChange("age", Number(event.target.value))
            }
          >
            {AGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>Tamaño actual</span>
          <select
            className={styles.control}
            required
            value={values.size}
            onChange={(event) => {
              const size = SIZE_OPTIONS.find(
                (option) => option.value === Number(event.target.value),
              )?.value;
              if (size !== undefined) onFieldChange("size", size);
            }}
          >
            {SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.actions}>
          <Button
            type="submit"
            className={styles.saveButton}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </section>
  );
}
