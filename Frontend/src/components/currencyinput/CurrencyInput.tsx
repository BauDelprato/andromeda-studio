import { useId, type InputHTMLAttributes } from "react";
import styles from "./CurrencyInput.module.css";

export interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  label: string;
  value: string;
  currencySymbol?: string;
  onChange: (value: string) => void;
}

export function CurrencyInput({
  label,
  value,
  currencySymbol = "$",
  onChange,
  id,
  className,
  disabled,
  ...inputProps
}: CurrencyInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    if (rawValue === "" || /^\d*([.,]\d{0,2})?$/.test(rawValue)) {
      onChange(rawValue);
    }
  };

  return (
    <div className={`${styles.field} ${className ?? ""}`.trim()}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        {value !== "" && (
          <span className={styles.prefix} aria-hidden="true">
            {currencySymbol}
          </span>
        )}
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={currencySymbol}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          className={styles.input}
          {...inputProps}
        />
      </div>
    </div>
  );
}
