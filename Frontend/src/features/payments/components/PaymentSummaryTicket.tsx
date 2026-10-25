import type { Student } from "@/features/students/types/student";
import type { PaymentChargeSelection } from "@/features/payments/types/payment";
import { formatBillingPeriod, formatPaymentDate, paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import styles from "./PaymentSummaryTicket.module.css";

interface PaymentSummaryTicketProps {
  student: Student | null;
  date: string;
  charges: PaymentChargeSelection[];
  discountAmount: number;
}

export function PaymentSummaryTicket({ student, date, charges, discountAmount }: PaymentSummaryTicketProps) {
  const subtotal = charges.reduce((sum, { charge }) => sum + charge.amount, 0);
  const discount = Math.max(0, discountAmount);
  const total = Math.max(0, subtotal - discount);
  const grouped = new Map<string, { amount: number; periods: string[] }>();

  for (const { charge, crewName } of charges) {
    const group = grouped.get(crewName) ?? { amount: 0, periods: [] };
    group.amount += charge.amount;
    if (charge.billingPeriod && !group.periods.includes(charge.billingPeriod)) {
      group.periods.push(charge.billingPeriod);
    }
    grouped.set(crewName, group);
  }

  return (
    <aside className={styles.ticket} aria-label="Resumen del pago">
      <div className={styles.ticketHead}>
        <span className={styles.kicker}>ANDROMEDA · PAGOS</span>
        <h2>Resumen de pago</h2>
        <p>{formatPaymentDate(date)}</p>
        <p>{student ? student.firstName + " " + student.lastName : "Alumno pendiente de seleccionar"}</p>
        {student && <small>DNI {student.dni}</small>}
      </div>
      <div className={styles.rule} />
      <div className={styles.detailHead}>Detalle</div>
      {grouped.size ? (
        [...grouped.entries()].map(([name, group]) => (
          <div className={styles.line} key={name}>
            <div>
              <strong>{name}</strong>
              <small>{group.periods.map(formatBillingPeriod).join(" · ")}</small>
            </div>
            <b>{paymentCurrency.format(group.amount)}</b>
          </div>
        ))
      ) : (
        <div className={styles.empty}>Seleccioná un alumno y cargos para ver el detalle.</div>
      )}
      <div className={styles.bottom}>
        <div className={styles.totalLine}><span>Subtotal</span><b>{paymentCurrency.format(subtotal)}</b></div>
        <div className={styles.totalLine}><span>Descuento</span><b>−{paymentCurrency.format(discount)}</b></div>
        <div className={styles.grandTotal}><span>Total</span><strong>{paymentCurrency.format(total)}</strong></div>
      </div>
    </aside>
  );
}
