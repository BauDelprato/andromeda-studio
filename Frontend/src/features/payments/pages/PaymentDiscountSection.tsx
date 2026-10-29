import { LuTag } from "react-icons/lu";
import { paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import styles from "./PaymentRegisterPage.module.css";

interface PaymentDiscountSectionProps {
  discountAmount: number;
  hasSelectedDiscounts: boolean;
  discountError: string | null;
  onOpenDiscounts: () => void;
}

export function PaymentDiscountSection({
  discountAmount,
  hasSelectedDiscounts,
  discountError,
  onOpenDiscounts,
}: PaymentDiscountSectionProps) {
  return (
    <section className={styles.group}>
      <div className={styles.sectionHeading}>
        <div><h2>Descuentos</h2><p>Elegí los descuentos activos que se aplican a este pago</p></div>
      </div>
      <div className={styles.discountRow}>
        <div className={styles.discountInfo}>
          <span className={styles.discountIcon}><LuTag size={17} /></span>
          <div>
            <strong>Descuento</strong>
            <small>
              {discountAmount
                ? paymentCurrency.format(discountAmount) + " aplicado"
                : "Sin descuento aplicado"}
            </small>
          </div>
        </div>
        <button className={styles.secondaryButton} type="button" onClick={onOpenDiscounts}>
          {hasSelectedDiscounts ? "Editar descuentos" : "Agregar descuento"}
        </button>
      </div>
      {discountError && <p className={styles.error} role="alert">{discountError}</p>}
    </section>
  );
}
