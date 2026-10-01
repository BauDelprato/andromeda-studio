import type { ReactNode } from "react";
import { LuUsers } from "react-icons/lu";
import styles from "./Statcard.module.css";

interface StatCardProps {
  label: string;
  value: number | null | undefined;
  isLoading?: boolean;
  icon?: ReactNode;
}

export function StatCard({
  label,
  value,
  isLoading = false,
  icon,
}: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        {icon || <LuUsers size={22} className={styles.icon} />}
      </div>

      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {isLoading ? (
            <span className={styles.skeleton} aria-hidden="true" />
          ) : (
            (value ?? "—")
          )}
        </span>
      </div>
    </div>
  );
}