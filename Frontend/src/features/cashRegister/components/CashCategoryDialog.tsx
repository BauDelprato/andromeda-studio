import { useState, type FormEvent } from "react";
import { PaymentActionDialog } from "@/features/payments/components/PaymentActionDialog";
import { MOVEMENT_TYPE_LABELS } from "../constants/cashRegisterOptions";
import type { CreateCashCategoryRequest, MovementType } from "../types/cashRegister";
import styles from "./CashDialogForm.module.css";

interface CashCategoryDialogProps {
  onClose: () => void;
  onSubmit: (request: CreateCashCategoryRequest) => void;
}

export function CashCategoryDialog({ onClose, onSubmit }: CashCategoryDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<MovementType>(0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), type });
    onClose();
  }

  return (
    <PaymentActionDialog title="Añadir nueva categoría" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Nombre de la categoría</span>
          <input required maxLength={40} value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <div className={styles.typePicker} role="group" aria-label="Tipo de categoría">
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
        <div className={styles.actions}>
          <button className={styles.secondary} type="button" onClick={onClose}>Cancelar</button>
          <button className={styles.primary} type="submit">Crear categoría</button>
        </div>
      </form>
    </PaymentActionDialog>
  );
}
