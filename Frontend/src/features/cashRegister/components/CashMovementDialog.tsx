import { useState, type FormEvent } from "react";
import { PaymentActionDialog } from "@/features/payments/components/PaymentActionDialog";
import { CASH_PAYMENT_METHOD_LABELS, MOVEMENT_TYPE_LABELS } from "../constants/cashRegisterOptions";
import type {
  CashCategory,
  CreateCashMovementRequest,
  MovementType,
  PaymentMethod,
} from "../types/cashRegister";
import { toLocalDateTimeInput } from "../utils/cashRegisterFormatting";
import styles from "./CashDialogForm.module.css";

interface CashMovementDialogProps {
  categories: CashCategory[];
  onClose: () => void;
  onSubmit: (request: CreateCashMovementRequest) => void;
}

export function CashMovementDialog({ categories, onClose, onSubmit }: CashMovementDialogProps) {
  const [type, setType] = useState<MovementType>(0);
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(() => toLocalDateTimeInput(new Date()));
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>(0);
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const typeCategories = categories.filter((category) => category.type === type);

  function changeType(value: MovementType) {
    setType(value);
    setCategoryId("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!categoryId || !reason.trim() || !(parsedAmount > 0) || !date) {
      setError("Completá categoría, motivo, fecha y un monto mayor a cero.");
      return;
    }
    onSubmit({
      date: new Date(date).toISOString(),
      type,
      categoryId: Number(categoryId),
      reason: reason.trim(),
      method,
      amount: parsedAmount,
      notes: notes.trim() || null,
      transactionReference: method === 1 ? reference.trim() || null : null,
    });
    onClose();
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
              onClick={() => changeType(value)}
            >
              {MOVEMENT_TYPE_LABELS[value]}
            </button>
          ))}
        </div>
        <label className={styles.field}>
          <span>Fecha y hora</span>
          <input required type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Categoría</span>
          <select required value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
            <option value="">Seleccioná una categoría</option>
            {typeCategories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>Motivo</span>
          <input required value={reason} onChange={(event) => setReason(event.target.value)} />
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
        {method === 1 && (
          <label className={styles.field}>
            <span>Referencia de transferencia</span>
            <input value={reference} onChange={(event) => setReference(event.target.value)} />
          </label>
        )}
        <label className={styles.field}>
          <span>Notas</span>
          <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}>
          <button className={styles.secondary} type="button" onClick={onClose}>Cancelar</button>
          <button className={styles.primary} type="submit">Registrar movimiento</button>
        </div>
      </form>
    </PaymentActionDialog>
  );
}
