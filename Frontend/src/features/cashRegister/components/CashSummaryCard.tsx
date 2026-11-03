import { paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import styles from "./CashSummaryCard.module.css";

interface CashSummaryCardProps {
  label: string;
  amount: number | null;
  isLoading?: boolean;
}

export function CashSummaryCard({ label, amount, isLoading = false }: CashSummaryCardProps) {
  return (
    <article className={styles.card}>
      <h3>{label}</h3>
      <strong>{isLoading ? "…" : amount === null ? "—" : paymentCurrency.format(amount)}</strong>
    </article>
  );
}
