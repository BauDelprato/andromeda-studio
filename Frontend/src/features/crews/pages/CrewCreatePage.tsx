import { CrewCreateForm } from "../components/CrewCreateForm/CrewCreateForm";
import { useCrewCreate } from "../hooks/useCrewCreate";
import styles from "./CrewCreatePage.module.css";

export default function CrewCreatePage() {
  const { values, isSaving, error, saved, updateField, handleSubmit } = useCrewCreate();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Crear Crew</h1>
      </header>

      <CrewCreateForm
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
