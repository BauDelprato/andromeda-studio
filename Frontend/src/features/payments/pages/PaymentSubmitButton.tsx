import { paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import styles from "./PaymentRegisterPage.module.css";

interface PaymentSubmitButtonProps {
  amount: number;
  isSubmitting: boolean;
  disabled: boolean;
}

export function PaymentSubmitButton({ amount, isSubmitting, disabled }: PaymentSubmitButtonProps) {
  return (
    <button className={styles.saveButton} type="submit" disabled={disabled}>
      <span>{isSubmitting ? "Registrando..." : "Guardar pago"}</span>
      <strong>{paymentCurrency.format(amount)}</strong>
    </button>
  );
}
