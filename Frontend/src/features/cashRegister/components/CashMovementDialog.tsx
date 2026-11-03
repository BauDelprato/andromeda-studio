import { useState, type FormEvent } from "react";
import { PaymentActionDialog } from "@/features/payments/components/PaymentActionDialog";
import { CASH_PAYMENT_METHOD_LABELS, MOVEMENT_TYPE_LABELS } from "../constants/cashRegisterOptions";
import type {
  CreateCashMovementRequest,
  MovementType,
  PaymentMethod,
  CashCategory,
} from "../types/cashRegister";
import styles from "./CashDialogForm.module.css";

interface CashMovementDialogProps {
  categories: CashCategory[];
  onClose: () => void;
  onSubmit: (request: CreateCashMovementRequest) => Promise<void>;
}

export function CashMovementDialog({ categories, onClose, onSubmit }: CashMovementDialogProps) {
  const [type, setType] = useState<MovementType>(0);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!categoryId || !Number.isFinite(parsedAmount) || !(parsedAmount > 0)) {
      setError("Seleccioná una categoría e ingresá un monto mayor a cero.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        type,
        categoryId: Number(categoryId),
        method,
        amount: parsedAmount,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo registrar el movimiento.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PaymentActionDialog title="Registrar movimiento" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.typePicker} role="group" aria-label="Tipo de movimiento">
          {([0, 1] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={type === value}
              className={`${styles.typeOption} ${type === value ? styles.typeOptionActive : ""}`}
              onClick={() => setType(value)}
            >
              {MOVEMENT_TYPE_LABELS[value]}
            </button>
          ))}
        </div>
        <label className={styles.field}>
          <span>Categoría</span>
          <select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">Seleccioná una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Notas</span>
          <input value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Monto</span>
          <input required type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Método de pago</span>
          <select value={method} onChange={(event) => setMethod(Number(event.target.value) as PaymentMethod)}>
            {([0, 1] as const).map((value) => (
              <option key={value} value={value}>{CASH_PAYMENT_METHOD_LABELS[value]}</option>
            ))}
          </select>
        </label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}>
          <button className={styles.secondary} type="button" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
          <button className={styles.primary} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Registrar movimiento"}
          </button>
        </div>
      </form>
    </PaymentActionDialog>
  );
}
