import { useEffect, useState, type FormEvent } from "react";
import {
  CREW_TARIFF_FIELDS,
  CREW_TARIFF_SECTIONS,
  EMPTY_CREW_TARIFFS_FORM,
} from "../constants/emptyCrewTariffsForm";
import type {
  CrewTariffFieldKey,
  CrewTariffGroupKey,
  CrewTariffsFormValues,
  SaveCrewTariffsRequest,
} from "../types/crewTariff";

export interface UseCrewTariffsOptions {
  initialValues?: CrewTariffsFormValues;
  isLoading?: boolean;
  loadError?: string | null;
  onSave?: (payload: SaveCrewTariffsRequest) => Promise<void> | void;
}

function parseAmount(rawValue: string): number {
  return Number(rawValue.replace(",", "."));
}

export function useCrewTariffs(options: UseCrewTariffsOptions = {}) {
  const {
    initialValues,
    isLoading = false,
    loadError = null,
    onSave,
  } = options;

  const [values, setValues] = useState<CrewTariffsFormValues>(
    initialValues ?? EMPTY_CREW_TARIFFS_FORM,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(loadError);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    setError(loadError);
  }, [loadError]);

  function updateField(
    group: CrewTariffGroupKey,
    field: CrewTariffFieldKey,
    value: string,
  ) {
    setValues((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [field]: value,
      },
    }));
    setError(null);
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    for (const section of CREW_TARIFF_SECTIONS) {
      for (const field of CREW_TARIFF_FIELDS) {
        const rawValue = values[section.key][field.key].trim();
        const numericValue = parseAmount(rawValue);

        if (rawValue === "" || Number.isNaN(numericValue) || numericValue < 0) {
          setError(
            `Ingresá un importe válido para "${field.label}" en ${section.title}.`,
          );
          setSaved(false);
          return;
        }
      }
    }

    const payload: SaveCrewTariffsRequest = {
      tariffs: CREW_TARIFF_SECTIONS.map((section) => ({
        crewLevel: section.crewLevel,
        regularFee: parseAmount(values[section.key].regularFee),
        payment1To5: parseAmount(values[section.key].payment1To5),
        payment6To10: parseAmount(values[section.key].payment6To10),
      })),
    };

    if (!onSave) {
      setError(null);
      setSaved(true);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      await onSave(payload);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron guardar las tarifas.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
    values,
    isLoading,
    isSaving,
    error,
    saved,
    updateField,
    handleSubmit,
  };
}
