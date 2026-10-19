import { useEffect, useRef, useState, type FormEvent } from "react";
import { getCrewById, updateCrewApi } from "@/api/crewApi";
import type { CrewFormData } from "../types/crew";

export function useCrewEdit(crewId: string | undefined) {
  const id = Number(crewId);
  const validId =
    crewId !== undefined &&
    Number.isInteger(id) &&
    id > 0;
  const activeIdRef = useRef(id);
  const saveGenerationRef = useRef(0);

  activeIdRef.current = id;

  const [values, setValues] = useState<CrewFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    saveGenerationRef.current += 1;

    setIsLoading(true);
    setIsSaving(false);
    setError(null);
    setSaved(false);
    setValues(null);

    if (!validId) {
      setError("El identificador de la Crew no es válido.");
      setIsLoading(false);

      return () => {
        cancelled = true;
        saveGenerationRef.current += 1;
      };
    }

    async function loadCrew() {
      try {
        const crew = await getCrewById(id);

        if (cancelled) return;

        setValues({
          name: crew.name,
          level: crew.level,
          age: crew.age,
          size: crew.size,
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la Crew.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadCrew();

    return () => {
      cancelled = true;
      saveGenerationRef.current += 1;
    };
  }, [id, validId]);

  function updateField<K extends keyof CrewFormData>(
    field: K,
    value: CrewFormData[K],
  ) {
    setValues((current) =>
      current ? { ...current, [field]: value } : current,
    );
    setError(null);
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values || !validId) return;

    const saveGeneration = saveGenerationRef.current;
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updateCrewApi(id, values);
      if (
        activeIdRef.current === id &&
        saveGenerationRef.current === saveGeneration
      ) {
        setSaved(true);
      }
    } catch (err) {
      if (
        activeIdRef.current === id &&
        saveGenerationRef.current === saveGeneration
      ) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron guardar los cambios.",
        );
      }
    } finally {
      if (
        activeIdRef.current === id &&
        saveGenerationRef.current === saveGeneration
      ) {
        setIsSaving(false);
      }
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
