import { useState } from "react";
import { Link } from "react-router-dom";
import { PaymentActionDialog } from "@/features/payments/components/PaymentActionDialog";
import { PaymentSummaryTicket } from "@/features/payments/components/PaymentSummaryTicket";
import { usePaymentRegistration } from "@/features/payments/hooks/usePaymentRegistration";
import { PaymentChargesSection } from "@/features/payments/pages/PaymentChargesSection";
import { PaymentDateSection } from "@/features/payments/pages/PaymentDateSection";
import { PaymentDiscountSection } from "@/features/payments/pages/PaymentDiscountSection";
import { PaymentFormFeedback } from "@/features/payments/pages/PaymentFormFeedback";
import { PaymentMethodSection } from "@/features/payments/pages/PaymentMethodSection";
import { PaymentNotesSection } from "@/features/payments/pages/PaymentNotesSection";
import { PaymentSubmitButton } from "@/features/payments/pages/PaymentSubmitButton";
import { StudentCrewSection } from "@/features/payments/pages/StudentCrewSection";
import type { Crew } from "@/features/crews/types/crew";
import type { StudentCrewResponse } from "@/features/crews/types/studentCrew";
import type { DiscountType } from "@/features/payments/types/payment";
import { formatBillingPeriod, paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import styles from "./PaymentRegisterPage.module.css";

type DialogState =
  | { type: "discount" }
  | { type: "periods"; studentCrewId: number }
  | { type: "generate" }
  | null;

const discountTypeLabels: Record<DiscountType, string> = {
  0: "Porcentaje",
  1: "Importe fijo",
};

export default function PaymentRegisterPage() {
  const payment = usePaymentRegistration();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [periodDraft, setPeriodDraft] = useState<string[]>([]);
  const [discountDraft, setDiscountDraft] = useState<number[]>([]);
  const activeCrewSelection = dialog?.type === "periods"
    ? payment.availableCrews.find(({ relation }) => relation.id === dialog.studentCrewId)
    : undefined;
  const activeCrewCharges = activeCrewSelection
    ? payment.getSelectionsForCrew(activeCrewSelection.relation, activeCrewSelection.crew)
    : [];
  const periodOptions = [...new Set(activeCrewCharges
    .map(({ charge }) => charge.billingPeriod)
    .filter((period): period is string => period !== null))];

  function openPeriods(relation: StudentCrewResponse, crew: Crew) {
    const selections = payment.getSelectionsForCrew(relation, crew);
    const selectedPeriods = selections
      .filter(({ charge }) => payment.selectedChargeIds.includes(charge.id))
      .map(({ charge }) => charge.billingPeriod)
      .filter((period): period is string => period !== null);
    setPeriodDraft([...new Set(selectedPeriods)]);
    setDialog({ type: "periods", studentCrewId: relation.id });
  }

  function applyPeriods() {
    if (!activeCrewSelection) return;
    const selections = payment.getSelectionsForCrew(activeCrewSelection.relation, activeCrewSelection.crew);
    const chargeIds = selections.map(({ charge }) => charge.id);
    const selectedIds = selections
      .filter(({ charge }) => charge.billingPeriod !== null && periodDraft.includes(charge.billingPeriod))
      .map(({ charge }) => charge.id);
    payment.setChargesSelected(chargeIds, false);
    payment.setChargesSelected(selectedIds, true);
    setDialog(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await payment.submitPayment();
  }

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <Link className={styles.backLink} to="/payments">Volver a pagos</Link>
        <h1>Registrar un nuevo pago</h1>
        <p>Seleccioná los cargos pendientes que vas a incluir en este pago.</p>
      </header>

      {payment.error && <p className={styles.loadError} role="alert">{payment.error}</p>}

      <div className={styles.columns}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <PaymentDateSection
            value={payment.paymentDate}
            onChange={payment.setPaymentDate}
          />

          <StudentCrewSection
            students={payment.students}
            student={payment.student}
            availableCrews={payment.availableCrews}
            selectedCrews={payment.selectedCrews}
            isLoadingCharges={payment.isLoadingCharges}
            chargesError={payment.chargesError}
            hasGeneralCharges={payment.generalCharges.length > 0}
            onSelectStudent={(student) => {
              void payment.selectStudent(student);
            }}
            onAddCrew={payment.addCrew}
          />

          <PaymentChargesSection
            hasStudent={!!payment.student}
            isLoadingCharges={payment.isLoadingCharges}
            chargesError={payment.chargesError}
            availableCrews={payment.availableCrews}
            selectedCrews={payment.selectedCrews}
            generalCharges={payment.generalCharges}
            selectedChargeIds={payment.selectedChargeIds}
            getSelectionsForCrew={payment.getSelectionsForCrew}
            onToggleCharge={payment.toggleCharge}
            onRemoveCrew={payment.removeCrew}
            onSelectPeriods={openPeriods}
            onGenerateCharges={() => setDialog({ type: "generate" })}
          />

          <PaymentDiscountSection
            discountAmount={payment.discountAmount}
            hasSelectedDiscounts={payment.selectedDiscounts.length > 0}
            discountError={payment.discountError}
            onOpenDiscounts={() => {
              setDiscountDraft(payment.selectedDiscountIds);
              setDialog({ type: "discount" });
            }}
          />

          <section className={styles.group}>
            <PaymentMethodSection
              method={payment.method}
              transactionReference={payment.transactionReference}
              onMethodChange={payment.setMethod}
              onTransactionReferenceChange={payment.setTransactionReference}
            />
            <PaymentNotesSection notes={payment.notes} onChange={payment.setNotes} />
          </section>

          <PaymentFormFeedback
            submitError={payment.submitError}
            successMessage={payment.successMessage}
          />
          <PaymentSubmitButton
            amount={payment.paymentAmount}
            isSubmitting={payment.isSubmitting}
            disabled={
              payment.isLoading ||
              payment.isLoadingCharges ||
              payment.isSubmitting ||
              !!payment.error ||
              !payment.student ||
              payment.selectedCharges.length === 0 ||
              !!payment.discountError ||
              !!payment.successMessage
            }
          />
        </form>

        <PaymentSummaryTicket
          student={payment.student}
          date={payment.paymentDate}
          charges={payment.selectedCharges}
          discountAmount={payment.discountAmount}
        />
      </div>

      {dialog?.type === "discount" && (
        <PaymentActionDialog title="Agregar descuentos" onClose={() => setDialog(null)}>
          <p className={styles.dialogCopy}>Seleccioná los descuentos activos que querés aplicar a los cargos elegidos.</p>
          {payment.discounts.length ? (
            <div className={styles.discountOptions}>
              {payment.discounts.map((discount) => (
                <label className={styles.discountOption} key={discount.id}>
                  <input
                    type="checkbox"
                    checked={discountDraft.includes(discount.id)}
                    onChange={() => setDiscountDraft((current) => current.includes(discount.id)
                      ? current.filter((id) => id !== discount.id)
                      : [...current, discount.id])}
                  />
                  <span>
                    <strong>{discount.name}</strong>
                    <small>
                      {discountTypeLabels[discount.type]} · {discount.type === 0
                        ? discount.discountAmount + "%"
                        : paymentCurrency.format(discount.discountAmount)}
                    </small>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className={styles.emptyNotice}>No hay descuentos activos cargados.</div>
          )}
          <div className={styles.dialogActions}>
            <button className={styles.dialogSecondary} type="button" onClick={() => setDialog(null)}>Cancelar</button>
            <button className={styles.dialogPrimary} type="button" onClick={() => {
              payment.setDiscountSelection(discountDraft);
              setDialog(null);
            }}>Aplicar descuentos</button>
          </div>
        </PaymentActionDialog>
      )}

      {dialog?.type === "periods" && activeCrewSelection && (
        <PaymentActionDialog title="Seleccionar períodos" onClose={() => setDialog(null)}>
          <p className={styles.dialogCopy}>Elegí los períodos que querés incluir para {activeCrewSelection.crew.name}.</p>
          <div className={styles.periods}>
            {periodOptions.map((period) => (
              <label key={period}>
                <input
                  type="checkbox"
                  checked={periodDraft.includes(period)}
                  onChange={() => setPeriodDraft((current) => current.includes(period)
                    ? current.filter((item) => item !== period)
                    : [...current, period])}
                />
                <span>{formatBillingPeriod(period)}</span>
              </label>
            ))}
          </div>
          <button className={styles.dialogPrimary} type="button" onClick={applyPeriods}>Aplicar períodos</button>
        </PaymentActionDialog>
      )}

      {dialog?.type === "generate" && (
        <PaymentActionDialog title="Generar cargos" onClose={() => setDialog(null)}>
          <p className={styles.dialogCopy}>Esta pantalla permite registrar cargos pendientes existentes. La generación de cargos queda fuera de este flujo.</p>
          <button className={styles.dialogPrimary} type="button" onClick={() => setDialog(null)}>Entendido</button>
        </PaymentActionDialog>
      )}
    </main>
  );
}
