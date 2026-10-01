import type { FitnessCertificateStatus } from "@/types/student/studentForm";
import styles from "./StatusPill.module.css";

export interface StatusPillProps {
  status: FitnessCertificateStatus;
  onClick?: () => void;
  disabled?: boolean;
}

const STATUS_LABELS: Record<FitnessCertificateStatus, string> = {
  vigente: "Vigente",
  vencido: "Vencido",
  pendiente: "Pendiente",
};

export function StatusPill({
  status,
  onClick,
  disabled = false,
}: StatusPillProps) {
  const isClickable = !!onClick && !disabled;

  if (isClickable) {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={`${styles.pill} ${styles[status]} ${styles.clickable}`}
        title="Clic para alternar estado"
        aria-label={`Estado del apto físico: ${STATUS_LABELS[status]}`}
      >
        {STATUS_LABELS[status]}
      </button>
    );
  }

  return (
    <span className={`${styles.pill} ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
