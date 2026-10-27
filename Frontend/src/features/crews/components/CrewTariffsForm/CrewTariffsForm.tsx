import type { FormEvent } from "react";
import { Button } from "@/components/Button/Button";
import { CurrencyInput } from "@/components/currencyinput/CurrencyInput";
import {
  CREW_TARIFF_FIELDS,
  CREW_TARIFF_SECTIONS,
} from "../../constants/emptyCrewTariffsForm";
import type {
  CrewTariffFieldKey,
  CrewTariffGroupKey,
  CrewTariffsFormValues,
} from "../../types/crewTariff";
import styles from "./CrewTariffsForm.module.css";

export interface CrewTariffsFormProps {
  values: CrewTariffsFormValues;
  isLoading?: boolean;
  isSaving?: boolean;
  error?: string | null;
  saved?: boolean;
  onFieldChange: (
    group: CrewTariffGroupKey,
    field: CrewTariffFieldKey,
    value: string,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function CrewTariffsForm({
  values,
  isLoading = false,
  isSaving = false,
  error = null,
  saved = false,
  onFieldChange,
  onSubmit,
}: CrewTariffsFormProps) {
  if (isLoading) {
    return (
      <section className={styles.card} aria-busy="true">
        <h2 className={styles.title}>Tarifas</h2>
        <p className={styles.stateMessage}>Cargando tarifas...</p>
      </section>
    );
  }

  return (
    <section className={styles.card} aria-labelledby="crew-tariffs-title">
      <h2 className={styles.title} id="crew-tariffs-title">
        Tarifas
      </h2>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {error && (
          <p className={styles.errorMessage} role="alert">
            {error}
          </p>
        )}

        {saved && (
          <p className={styles.successMessage} role="status">
            Tarifas actualizadas correctamente.
          </p>
        )}

        <div className={styles.sections}>
          {CREW_TARIFF_SECTIONS.map((section) => (
            <fieldset key={section.key} className={styles.groupSection}>
              <legend className={styles.groupTitle}>{section.title}</legend>

              <div className={styles.fieldList}>
                {CREW_TARIFF_FIELDS.map((field) => (
                  <CurrencyInput
                    key={field.key}
                    id={`${section.key}-${field.key}`}
                    name={`${section.key}.${field.key}`}
                    label={field.label}
                    value={values[section.key][field.key]}
                    disabled={isSaving}
                    onChange={(nextValue) =>
                      onFieldChange(section.key, field.key, nextValue)
                    }
                  />
                ))}
              </div>
            </fieldset>
          ))}
        </div>

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
