import { useState, type FormEvent } from "react";
import { PaymentActionDialog } from "@/features/payments/components/PaymentActionDialog";
import { paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import styles from "./CashDialogForm.module.css";

interface CashSessionDialogProps {
  mode: "open" | "close";
  balance: number;
  onClose: () => void;
  onOpenSession: (openingAmount: number) => void;
  onCloseSession: () => void;
}

export function CashSessionDialog({ mode, balance, onClose, onOpenSession, onCloseSession }: CashSessionDialogProps) {
  const [openingAmount, setOpeningAmount] = useState("0");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "open") {
      const amount = Number(openingAmount);
      if (!(amount >= 0)) return;
      onOpenSession(amount);
    } else {
      onCloseSession();
    }
    onClose();
  }

  return (
    <PaymentActionDialog title={mode === "open" ? "Abrir caja" : "Cerrar caja"} onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === "open" ? (
          <label className={styles.field}>
            <span>Monto inicial en caja</span>
            <input required type="number" min="0" step="0.01" value={openingAmount} onChange={(event) => setOpeningAmount(event.target.value)} />
          </label>
        ) : (
          <p className={styles.hint}>
            Vas a cerrar la caja con un balance de <strong>{paymentCurrency.format(balance)}</strong>. No se podrán registrar más movimientos hasta volver a abrirla.
          </p>
        )}
        <div className={styles.actions}>
          <button className={styles.secondary} type="button" onClick={onClose}>Cancelar</button>
          <button className={mode === "open" ? styles.primary : styles.danger} type="submit">
            {mode === "open" ? "Abrir caja" : "Cerrar caja"}
          </button>
        </div>
      </form>
    </PaymentActionDialog>
  );
}
