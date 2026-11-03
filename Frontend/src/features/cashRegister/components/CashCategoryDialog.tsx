import { useState, type FormEvent } from "react";
import { PaymentActionDialog } from "@/features/payments/components/PaymentActionDialog";
import type { CreateCashCategoryRequest } from "../types/cashRegister";
import styles from "./CashDialogForm.module.css";

interface CashCategoryDialogProps {
  onClose: () => void;
  onSubmit: (request: CreateCashCategoryRequest) => Promise<void>;
}

export function CashCategoryDialog({ onClose, onSubmit }: CashCategoryDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || null });
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo crear la categoría.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PaymentActionDialog title="Añadir nueva categoría" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Nombre de la categoría</span>
          <input required maxLength={40} value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className={styles.field}>
          <span>Descripción</span>
          <input maxLength={200} value={description} onChange={(event) => setDescription(event.target.value)} />
        </label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}>
          <button className={styles.secondary} type="button" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
          <button className={styles.primary} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Crear categoría"}
          </button>
        </div>
      </form>
    </PaymentActionDialog>
  );
}
