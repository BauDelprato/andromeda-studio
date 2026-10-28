import { LuCalendarDays } from "react-icons/lu";
import styles from "./PaymentRegisterPage.module.css";

interface PaymentDateSectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaymentDateSection({ value, onChange }: PaymentDateSectionProps) {
  return (
    <section className={styles.group}>
      <div className={styles.sectionHeading}>
        <div><h2>Fecha y hora</h2><p>Cuándo se recibió el pago</p></div>
      </div>
      <label className={styles.field}>
        <span>Fecha y hora del pago</span>
        <div className={styles.inputWithIcon}>
          <LuCalendarDays size={18} />
          <input
            type="datetime-local"
            required
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      </label>
    </section>
  );
}
