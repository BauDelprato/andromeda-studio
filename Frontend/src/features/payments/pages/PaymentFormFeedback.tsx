import { Link } from "react-router-dom";
import styles from "./PaymentRegisterPage.module.css";

interface PaymentFormFeedbackProps {
  submitError: string | null;
  successMessage: string | null;
}

export function PaymentFormFeedback({ submitError, successMessage }: PaymentFormFeedbackProps) {
  return (
    <>
      {submitError && <p className={styles.error} role="alert">{submitError}</p>}
      {successMessage && (
        <p className={styles.success} role="status">
          {successMessage} <Link to="/payments">Volver al listado de pagos</Link>
        </p>
      )}
    </>
  );
}
