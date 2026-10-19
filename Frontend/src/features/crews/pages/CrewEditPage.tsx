import { useParams } from "react-router-dom";
import { CrewEditForm } from "../components/CrewEditForm/CrewEditForm";
import { useCrewEdit } from "../hooks/useCrewEdit";
import styles from "./CrewEditPage.module.css";

export default function CrewEditPage() {
  const { crewId } = useParams<{ crewId: string }>();
  const {
    values,
    isLoading,
    isSaving,
    error,
    saved,
    updateField,
    handleSubmit,
  } = useCrewEdit(crewId);

  if (isLoading) {
    return (
      <div className={styles.container}>
        Cargando datos de la Crew...
      </div>
    );
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

      <CrewEditForm
        values={values}
        isSaving={isSaving}
        error={error}
        saved={saved}
        onFieldChange={updateField}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
