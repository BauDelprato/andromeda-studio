import { LuCreditCard } from "react-icons/lu";
import type { PaymentMethod } from "@/features/payments/types/payment";
import styles from "./PaymentRegisterPage.module.css";

interface PaymentMethodSectionProps {
  method: PaymentMethod;
  transactionReference: string;
  onMethodChange: (method: PaymentMethod) => void;
  onTransactionReferenceChange: (value: string) => void;
}

export function PaymentMethodSection({
  method,
  transactionReference,
  onMethodChange,
  onTransactionReferenceChange,
}: PaymentMethodSectionProps) {
  return (
    <>
      <div className={styles.sectionHeading}>
        <div><h2>Método de pago</h2><p>Elegí cómo se recibió el pago</p></div>
      </div>
      <div className={styles.methods}>
        <button
          type="button"
          className={method === 0 ? styles.methodActive : styles.method}
          onClick={() => onMethodChange(0)}
        >
          <span className={styles.methodMark}>$</span>
          <span><strong>Efectivo</strong><small>Pago en efectivo</small></span>
          <span className={styles.radio} />
        </button>
        <button
          type="button"
          className={method === 1 ? styles.methodActive : styles.method}
          onClick={() => onMethodChange(1)}
        >
          <LuCreditCard size={20} />
          <span><strong>Transferencia</strong><small>Transferencia bancaria</small></span>
          <span className={styles.radio} />
        </button>
      </div>
      {method === 1 && (
        <label className={styles.field}>
          <span>Referencia de transacción <small>(opcional)</small></span>
          <input
            className={styles.control}
            value={transactionReference}
            onChange={(event) => onTransactionReferenceChange(event.target.value)}
            placeholder="Número o referencia"
          />
        </label>
      )}
    </>
  );
}
