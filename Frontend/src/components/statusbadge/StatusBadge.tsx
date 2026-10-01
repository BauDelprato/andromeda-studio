import type { ReactNode } from "react";
import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  children: ReactNode;
  variant?: "positive" | "negative";
}

function StatusBadge({ children, variant = "positive" }: StatusBadgeProps) {
  const variantClass = variant === "positive" ? styles.positive : styles.negative;

  return <span className={`${styles.badge} ${variantClass}`}>{children}</span>;
}

export default StatusBadge;
