import type { MouseEvent, ReactNode } from "react";
import { LuX } from "react-icons/lu";
import styles from "./PaymentActionDialog.module.css";

interface PaymentActionDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function PaymentActionDialog({ title, onClose, children }: PaymentActionDialogProps) {
  function closeFromOverlay(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <div className={styles.overlay} onMouseDown={closeFromOverlay}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="payment-dialog-title">
        <header className={styles.header}>
          <h2 id="payment-dialog-title">{title}</h2>
          <button className={styles.close} type="button" onClick={onClose} aria-label="Cerrar diálogo">
            <LuX size={19} />
          </button>
        </header>
        <div className={styles.content}>{children}</div>
      </section>
    </div>
  );
}
