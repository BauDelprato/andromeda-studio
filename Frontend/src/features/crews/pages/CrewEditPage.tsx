import { useParams, useNavigate } from "react-router-dom";
import { CrewEditForm } from "../components/CrewEditForm/CrewEditForm";
import { useCrewEdit } from "../hooks/useCrewEdit";
import { Button } from "@/components/Button/Button"; 
import styles from "./CrewEditPage.module.css";

export default function CrewEditPage() {
  const { crewId } = useParams<{ crewId: string }>();
  const navigate = useNavigate(); // Hook para navegar hacia atrás
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
        <div className={styles.contentWrapper}>
          Cargando datos de la Crew...
        </div>
      </div>
    );
  }

  if (!values) {
    return (
      <div className={styles.container} role="alert">
        <div className={styles.contentWrapper}>
          {error ?? "No se encontró la Crew."}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Editar Crew</h1>
          <Button onClick={() => navigate(-1)} className={styles.backButton}>
            Volver
          </Button>
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
    </div>
  );
}