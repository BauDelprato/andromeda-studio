import { useState, type FormEvent } from "react";
import { PaymentActionDialog } from "@/features/payments/components/PaymentActionDialog";
import { paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import styles from "./CashDialogForm.module.css";

interface CashSessionDialogProps {
  mode: "open" | "close";
  balance: number;
  onClose: () => void;
  onOpenSession: () => Promise<void>;
  onCloseSession: () => Promise<void>;
}

export function CashSessionDialog({ mode, balance, onClose, onOpenSession, onCloseSession }: CashSessionDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (mode === "open") {
        await onOpenSession();
      } else {
        await onCloseSession();
      }
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "No se pudo actualizar la caja.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PaymentActionDialog title={mode === "open" ? "Abrir caja" : "Cerrar caja"} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === "open" ? (
          <p className={styles.hint}>
            El saldo inicial se calcula automáticamente a partir del cierre de la caja anterior.
          </p>
        ) : (
          <p className={styles.hint}>
            Vas a cerrar la caja con un balance de <strong>{paymentCurrency.format(balance)}</strong>. No se podrán registrar más movimientos hasta volver a abrirla.
          </p>
        )}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <div className={styles.actions}>
          <button className={styles.secondary} type="button" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
          <button className={mode === "open" ? styles.primary : styles.danger} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : mode === "open" ? "Abrir caja" : "Cerrar caja"}
          </button>
        </div>
      </form>
    </PaymentActionDialog>
  );
}
