import { useState, type FormEvent } from "react";
import { PaymentActionDialog } from "@/features/payments/components/PaymentActionDialog";
import { DEFAULT_MONTHLY_FILTERS, WEEKDAY_NAMES } from "../constants/cashRegisterHistoryOptions";
import type { CashMonthlyFilters } from "../types/cashRegisterHistory";
import styles from "./CashDialogForm.module.css";

interface CashMonthlyFiltersDialogProps {
  filters: CashMonthlyFilters;
  onApply: (filters: CashMonthlyFilters) => void;
  onClose: () => void;
}

export function CashMonthlyFiltersDialog({ filters, onApply, onClose }: CashMonthlyFiltersDialogProps) {
  const [weekday, setWeekday] = useState<string>(String(filters.weekday));
  const [minAmount, setMinAmount] = useState(filters.minFinalBalance === null ? "" : String(filters.minFinalBalance));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedMin = minAmount.trim() === "" ? null : Number(minAmount);
    onApply({
      weekday: weekday === "all" ? "all" : Number(weekday),
      minFinalBalance: parsedMin !== null && Number.isFinite(parsedMin) ? parsedMin : null,
    });
    onClose();
  }

  function handleClear() {
    onApply(DEFAULT_MONTHLY_FILTERS);
    onClose();
  }

  return (
    <PaymentActionDialog title="Filtros" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Día de la semana</span>
          <select value={weekday} onChange={(event) => setWeekday(event.target.value)}>
            <option value="all">Todos los días</option>
            {WEEKDAY_NAMES.map((name, index) => (
              <option key={name} value={index}>{name}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Monto final mínimo</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Sin mínimo"
            value={minAmount}
            onChange={(event) => setMinAmount(event.target.value)}
          />
        </label>
        <p className={styles.hint}>Se muestran las cajas del mes cuyo monto final es igual o mayor al indicado.</p>
        <div className={styles.actions}>
          <button className={styles.secondary} type="button" onClick={handleClear}>Limpiar</button>
          <button className={styles.primary} type="submit">Aplicar filtros</button>
        </div>
      </form>
    </PaymentActionDialog>
  );
}
