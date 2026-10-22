import { MONTH_NAMES } from "../constants/paymentOptions";
import styles from "./PaymentPeriodFilter.module.css";

interface PaymentPeriodFilterProps {
  month: string;
  year: string;
  years: number[];
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export function PaymentPeriodFilter({
  month,
  year,
  years,
  onMonthChange,
  onYearChange,
}: PaymentPeriodFilterProps) {
  return (
    <div className={styles.filters} aria-label="Filtrar por período">
      <label className={styles.control}>
        <span>Mes</span>
        <select value={month} onChange={(event) => onMonthChange(event.target.value)}>
          <option value="all">Todos los meses</option>
          {MONTH_NAMES.map((name, index) => (
            <option key={name} value={String(index)}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.control}>
        <span>Año</span>
        <select value={year} onChange={(event) => onYearChange(event.target.value)}>
          <option value="all">Todos los años</option>
          {years.map((value) => (
            <option key={value} value={String(value)}>
              {value}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
