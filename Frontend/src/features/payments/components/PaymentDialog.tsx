import type { ReactNode } from "react";
import { useEffect } from "react";
import { LuX as CloseIcon } from "react-icons/lu";
import styles from "./PaymentDialog.module.css";

interface PaymentDialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function PaymentDialog({ title, onClose, children, className }: PaymentDialogProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`${styles.dialog} ${className ?? ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className={styles.header}>
          <h2>{title}</h2>
          <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Cerrar">
            <CloseIcon size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
