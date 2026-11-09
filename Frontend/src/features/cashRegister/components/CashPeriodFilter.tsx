import { LuCalendarDays } from "react-icons/lu";
import { MONTH_NAMES } from "@/features/payments/constants/paymentOptions";
import styles from "./CashPeriodFilter.module.css";

interface CashPeriodFilterProps {
  month: number;
  year: number;
  years: number[];
  onMonthChange: (value: number) => void;
  onYearChange: (value: number) => void;
  day?: number;
  daysInMonth?: number;
  onDayChange?: (value: number) => void;
}

export function CashPeriodFilter({
  month,
  year,
  years,
  onMonthChange,
  onYearChange,
  day,
  daysInMonth = 31,
  onDayChange,
}: CashPeriodFilterProps) {
  const showDay = day !== undefined && onDayChange !== undefined;

  return (
    <div className={styles.filters} role="group" aria-label="Filtrar por período">
      {showDay && <LuCalendarDays className={styles.icon} size={26} aria-hidden="true" />}
      {showDay && (
        <label className={styles.control}>
          <span>Día</span>
          <select value={day} onChange={(event) => onDayChange(Number(event.target.value))}>
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
      )}
      <label className={styles.control}>
        <span>Mes</span>
        <select value={month} onChange={(event) => onMonthChange(Number(event.target.value))}>
          {MONTH_NAMES.map((name, index) => (
            <option key={name} value={index}>{name}</option>
          ))}
        </select>
      </label>
      <label className={styles.control}>
        <span>Año</span>
        <select value={year} onChange={(event) => onYearChange(Number(event.target.value))}>
          {years.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
