import styles from "./ToggleGroup.module.css";

interface ToggleGroupProps {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

function ToggleGroup({ label, value, onChange }: ToggleGroupProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      <div className={styles.toggle} role="group" aria-label={label}>
        <button
          className={`${styles.option} ${value === true ? styles.selected : ""}`}
          type="button"
          aria-pressed={value === true}
          onClick={() => onChange(true)}
        >
          Sí
        </button>
        <button
          className={`${styles.option} ${value === false ? styles.selected : ""}`}
          type="button"
          aria-pressed={value === false}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default ToggleGroup;
