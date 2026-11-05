import type { PaymentCharge } from "@/features/payments/types/payment";
import { paymentCurrency, formatBillingPeriod, formatPaymentDate } from "@/features/payments/utils/paymentFormatters";
import { Button } from "@/components/Button/Button";
import styles from "./PaymentReceiptDialog.module.css";

interface PaymentReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  charge: PaymentCharge | null;
  studentName: string;
}

export function PaymentReceiptDialog({ isOpen, onClose, charge, studentName }: PaymentReceiptDialogProps) {
  if (!isOpen || !charge) return null;

  const title = `${charge.crewName || 'Clase'} - ${formatBillingPeriod(charge.billingPeriod)}`;
  const discount = 0; 
  const total = charge.amount - discount;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{title}</h3>
          <h1>{paymentCurrency.format(total)}</h1>
        </div>
        <ul className={styles.detailsList}>
          <li><span>Alumno:</span> <strong>{studentName}</strong></li>
          <li><span>Crew / Categoría:</span> <strong>{charge.crewName || 'N/A'}</strong></li>
          <li><span>Fecha:</span> <strong>{formatPaymentDate(charge.createdAt)}</strong></li>
          <li><span>Subtotal:</span> <strong>{paymentCurrency.format(charge.amount)}</strong></li>
          <li><span>Descuento:</span> <strong>{paymentCurrency.format(discount)}</strong></li>
          <li><span>Método de pago:</span> <strong>Efectivo</strong></li>
        </ul>
        <div className={styles.footer}>
          <Button onClick={onClose} className={styles.closeButton}>
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
}