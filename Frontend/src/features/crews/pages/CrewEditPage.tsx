import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { getCrewById, updateCrewApi } from "@/api/crewApi";
import { Button } from "@/components/Button/Button";
import type { CreateCrewFormData, CrewLevel, CrewSize } from "../types/crew";
import { getCrewMaxCapacity } from "../types/crew";
import styles from "./CrewEditPage.module.css";

const LEVEL_OPTIONS: Array<{ value: CrewLevel; label: string }> = [
  { value: 0, label: "Recreativo" },
  { value: 1, label: "Competitivo" },
  { value: 2, label: "Elite" },
];

const AGE_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 0, label: "Baby" },
  { value: 1, label: "Junior A" },
  { value: 2, label: "Junior B" },
  { value: 3, label: "Varsity A" },
  { value: 4, label: "Varsity Adult" },
  { value: 5, label: "Senior" },
];

const SIZE_OPTIONS: Array<{ value: CrewSize; label: string }> = [
  { value: 0, label: `Mini Crew · hasta ${getCrewMaxCapacity(0)} integrantes` },
  { value: 1, label: `Crew · hasta ${getCrewMaxCapacity(1)} integrantes` },
  { value: 2, label: `Mega Crew · hasta ${getCrewMaxCapacity(2)} integrantes` },
];

export default function CrewEditPage() {
  const { crewId } = useParams<{ crewId: string }>();
  const id = Number(crewId);
  const validId = crewId !== undefined && Number.isInteger(id) && id > 0;

  const [values, setValues] = useState<CreateCrewFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setValues(null);

    if (!validId) {
      setError("El identificador de la Crew no es válido.");
      setIsLoading(false);
      return () => {
        cancelled = true;
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
          setError(err instanceof Error ? err.message : "No se pudo cargar la Crew.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadCrew();

    return () => {
      cancelled = true;
    };
  }, [id, validId]);

  function updateField<K extends keyof CreateCrewFormData>(
    field: K,
    value: CreateCrewFormData[K],
  ) {
    setValues((current) => (current ? { ...current, [field]: value } : current));
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values || !validId) return;

    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      await updateCrewApi(id, values);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className={styles.container}>Cargando datos de la Crew...</div>;
  }

  if (!values) {
    return (
      <div className={styles.container} role="alert">
        {error ?? "No se encontró la Crew."}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Editar Crew</h1>
      </header>

      <section className={styles.editor} aria-labelledby="crew-edit-title">
        <h2 className={styles.sectionTitle} id="crew-edit-title">
          Datos de la Crew
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <p className={styles.errorMessage} role="alert">{error}</p>}
          {saved && <p className={styles.successMessage} role="status">Cambios guardados.</p>}

          <label className={`${styles.field} ${styles.nameField}`}>
            <span>Nombre de la Crew</span>
            <input
              autoComplete="off"
              className={styles.control}
              required
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Nivel actual</span>
            <select
              className={styles.control}
              required
              value={values.level}
              onChange={(event) => updateField("level", Number(event.target.value) as CrewLevel)}
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
              onChange={(event) => updateField("age", Number(event.target.value))}
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
              onChange={(event) => updateField("size", Number(event.target.value) as CrewSize)}
            >
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
    </div>
  );
}
