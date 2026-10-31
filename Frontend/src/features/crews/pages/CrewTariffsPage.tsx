import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button/Button";
import { CrewTariffsForm } from "../components/CrewTariffsForm/CrewTariffsForm";
import {
  useCrewTariffs,
  type UseCrewTariffsOptions,
} from "../hooks/useCrewTariffs";
import styles from "./CrewTariffsPage.module.css";

export type CrewTariffsPageProps = UseCrewTariffsOptions;

export default function CrewTariffsPage(props: CrewTariffsPageProps) {
  const navigate = useNavigate();
  const {
    values,
    isLoading,
    isSaving,
    error,
    saved,
    updateField,
    handleSubmit,
  } = useCrewTariffs(props);

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Clases</h1>
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            Volver
          </Button>
        </header>

        <CrewTariffsForm
          values={values}
          isLoading={isLoading}
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
