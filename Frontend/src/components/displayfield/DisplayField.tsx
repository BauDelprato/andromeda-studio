import type { ReactNode } from "react";
import styles from "./DisplayField.module.css";

interface DisplayFieldProps {
  label: string;
  value?: ReactNode;
}

function DisplayField({ label, value }: DisplayFieldProps) {
  const displayValue = value === null || value === undefined || value === "" ? "—" : value;

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <p className={styles.value}>{displayValue}</p>
    </div>
  );
}

export default DisplayField;
