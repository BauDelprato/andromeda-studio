import { useState, type FormEvent } from "react";
import { createCrewApi } from "@/api/crewApi";
import { EMPTY_CREW_CREATE_FORM } from "../constants/emptyCrewCreateForm";
import type { CrewCreateFormValues, CrewFormData } from "../types/crew";

export function useCrewCreate() {
  const [values, setValues] = useState<CrewCreateFormValues>({
    ...EMPTY_CREW_CREATE_FORM,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function updateField<K extends keyof CrewCreateFormValues>(
    field: K,
    value: CrewCreateFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    setError(null);
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { name, level, age, size } = values;

    if (!name.trim()) {
      setError("Ingresá el nombre de la Crew.");
      return;
    }

    if (level === "" || age === "" || size === "") {
      setError("Seleccioná el nivel, la edad y el tamaño de la Crew.");
      return;
    }

    const crewData: CrewFormData = {
      name: name.trim(),
      level,
      age,
      size,
    };

    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      await createCrewApi(crewData);
      setValues({ ...EMPTY_CREW_CREATE_FORM });
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo crear la Crew.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return {
    values,
    isSaving,
    error,
    saved,
    updateField,
    handleSubmit,
  };
}
