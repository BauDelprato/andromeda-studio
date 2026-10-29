import { LuTrash2 } from "react-icons/lu";
import type { PaymentChargeSelection } from "@/features/payments/types/payment";
import { formatBillingPeriod, paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import styles from "./PaymentCrewCard.module.css";

interface PaymentCrewCardProps {
  crewName: string;
  selections: PaymentChargeSelection[];
  selectedChargeIds: number[];
  onToggleCharge: (chargeId: number) => void;
  onRemove?: () => void;
  onSelectPeriods: () => void;
  onGenerateCharges: () => void;
  showActions?: boolean;
}

const chargeTypeLabels: Record<number, string> = {
  0: "Inscripción",
  1: "Crew",
  2: "Clase individual",
  3: "Paquete de clases",
  4: "Sesión de boxeo",
  5: "Paquete de boxeo",
};

export function PaymentCrewCard({
  crewName,
  selections,
  selectedChargeIds,
  onToggleCharge,
  onRemove,
  onSelectPeriods,
  onGenerateCharges,
  showActions = true,
}: PaymentCrewCardProps) {
  const selected = selections.filter(({ charge }) => selectedChargeIds.includes(charge.id));
  const total = selected.reduce((sum, { charge }) => sum + charge.amount, 0);
  const periods = [...new Set(selections.map(({ charge }) => charge.billingPeriod).filter((period): period is string => period !== null))];

  return (
    <article className={styles.card}>
      <div className={styles.topline}>
        <div>
          <h3>{crewName}</h3>
          <p>{selections.length} cargo{selections.length === 1 ? "" : "s"} disponible{selections.length === 1 ? "" : "s"}</p>
        </div>
        {onRemove && (
          <button className={styles.remove} type="button" onClick={onRemove} aria-label={"Quitar " + crewName}>
            <LuTrash2 size={18} />
          </button>
        )}
      </div>
      {selections.length > 0 ? (
        <div className={styles.chargeList}>
          {selections.map(({ charge }) => (
            <label className={styles.charge} key={charge.id}>
              <input
                type="checkbox"
                checked={selectedChargeIds.includes(charge.id)}
                onChange={() => onToggleCharge(charge.id)}
              />
              <span className={styles.chargeInfo}>
                <strong>{chargeTypeLabels[charge.type] ?? "Cargo"}</strong>
                <small>{formatBillingPeriod(charge.billingPeriod)}</small>
              </span>
              <span className={styles.amount}>{paymentCurrency.format(charge.amount)}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>No hay cargos pendientes para esta crew.</div>
      )}
      <div className={styles.footer}>
        {showActions && (
          <div className={styles.actions}>
            <button type="button" onClick={onSelectPeriods} disabled={!periods.length}>Seleccionar períodos</button>
            <button type="button" onClick={onGenerateCharges}>Generar cargos</button>
          </div>
        )}
        <span className={styles.total}>{paymentCurrency.format(total)}</span>
      </div>
    </article>
  );
}
