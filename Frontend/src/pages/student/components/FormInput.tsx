import type { ChangeEvent, InputHTMLAttributes } from "react";
import styles from "./FormInput.module.css";

interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange"> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function FormInput({ id, label, value, onChange, ...inputProps }: FormInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        className={styles.input}
        id={id}
        value={value}
        onChange={handleChange}
        {...inputProps}
      />
    </div>
  );
}

export default FormInput;
