import styles from "./Statcard.module.css";

interface StatCardProps {
  label: string;
  value: number | null | undefined;
  isLoading?: boolean;
}

export function StatCard({
  label,
  value,
  isLoading = false,
}: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>

      <span className={styles.value}>
        {isLoading ? (
          <span className={styles.skeleton} aria-hidden="true" />
        ) : (
          (value ?? "—")
        )}
      </span>
    </div>
  );
}