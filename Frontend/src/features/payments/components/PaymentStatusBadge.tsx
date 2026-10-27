import type { ChargeStatus } from "../types/charge";
import { CHARGE_STATUS_LABELS } from "../constants/paymentOptions";
import styles from "./PaymentStatusBadge.module.css";

interface PaymentStatusBadgeProps {
  status: ChargeStatus;
}

const statusStyles: Record<ChargeStatus, string> = {
  0: styles.pending,
  1: styles.paid,
  2: styles.partial,
  3: styles.overdue,
  4: styles.cancelled,
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${statusStyles[status]}`}>
      {CHARGE_STATUS_LABELS[status]}
    </span>
  );
}
