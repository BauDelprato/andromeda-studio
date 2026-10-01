import { LuCheck } from "react-icons/lu";
import styles from "./SegmentedToggle.module.css";

export interface SegmentedToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  trueLabel?: string;
  falseLabel?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  ariaLabel?: string;
}

export function SegmentedToggle({
  value,
  onChange,
  trueLabel = "Sí",
  falseLabel = "No",
  disabled = false,
  id,
  name,
  ariaLabel,
}: SegmentedToggleProps) {
  return (
    <div
      className={`${styles.container} ${disabled ? styles.disabled : ""}`}
      role="group"
      aria-label={ariaLabel}
      id={id}
    >
      <button
        type="button"
        name={name ? `${name}_true` : undefined}
        disabled={disabled}
        className={`${styles.button} ${value ? styles.active : ""}`}
        onClick={() => onChange(true)}
        aria-pressed={value}
      >
        {value && <LuCheck size={13} className={styles.icon} />}
        <span>{trueLabel}</span>
      </button>

      <button
        type="button"
        name={name ? `${name}_false` : undefined}
        disabled={disabled}
        className={`${styles.button} ${!value ? styles.active : ""}`}
        onClick={() => onChange(false)}
        aria-pressed={!value}
      >
        {!value && <LuCheck size={13} className={styles.icon} />}
        <span>{falseLabel}</span>
      </button>
    </div>
  );
}
