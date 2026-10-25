import { useState } from "react";
import { Link } from "react-router-dom";
import { LuCalendarDays, LuCreditCard, LuReceipt, LuTag } from "react-icons/lu";
import { StudentSearchSelect } from "@/features/crews/components/StudentSearchSelect/StudentSearchSelect";
import { PaymentActionDialog } from "@/features/payments/components/PaymentActionDialog";
import { PaymentCrewCard } from "@/features/payments/components/PaymentCrewCard";
import { PaymentSummaryTicket } from "@/features/payments/components/PaymentSummaryTicket";
import { usePaymentRegistration } from "@/features/payments/hooks/usePaymentRegistration";
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
  const generalChargeSelections = payment.generalCharges.map((charge) => ({
    charge,
    crewName: "Cargos generales",
  }));

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
          <section className={styles.group}>
            <div className={styles.sectionHeading}>
              <div><h2>Fecha y hora</h2><p>Cuándo se recibió el pago</p></div>
            </div>
            <label className={styles.field}>
              <span>Fecha y hora del pago</span>
              <div className={styles.inputWithIcon}>
                <LuCalendarDays size={18} />
                <input
                  type="datetime-local"
                  required
                  value={payment.paymentDate}
                  onChange={(event) => payment.setPaymentDate(event.target.value)}
                />
              </div>
            </label>
          </section>

          <section className={styles.group}>
            <div className={styles.sectionHeading}>
              <div><h2>Alumno y crews</h2><p>Buscá por nombre o DNI para ver sus crews asociadas</p></div>
            </div>
            <label className={styles.field}>
              <span>Alumno</span>
              <StudentSearchSelect
                students={payment.students}
                selectedStudent={payment.student}
                onSelect={(student) => {
                  void payment.selectStudent(student);
                }}
              />
            </label>
            {payment.student && (
              <label className={styles.field}>
                <span>Crew asociada</span>
                <div className={styles.selectWrap}>
                  <select
                    value=""
                    onChange={(event) => {
                      const studentCrewId = Number(event.target.value);
                      if (studentCrewId) payment.addCrew(studentCrewId);
                    }}
                    disabled={!payment.availableCrews.some(({ relation }) => !payment.selectedCrews.some((item) => item.relation.id === relation.id))}
                  >
                    <option value="">Seleccionar crew</option>
                    {payment.availableCrews
                      .filter(({ relation }) => !payment.selectedCrews.some((item) => item.relation.id === relation.id))
                      .map(({ relation, crew }) => (
                        <option key={relation.id} value={relation.id}>{crew.name}</option>
                      ))}
                  </select>
                </div>
              </label>
            )}
            {!payment.student && <p className={styles.hint}>Los cargos se mostrarán después de seleccionar un alumno.</p>}
            {payment.isLoadingCharges && <p className={styles.hint}>Cargando cargos pendientes...</p>}
            {payment.chargesError && <p className={styles.error} role="alert">{payment.chargesError}</p>}
            {payment.student && !payment.isLoadingCharges && payment.availableCrews.length === 0 && payment.generalCharges.length === 0 && (
              <div className={styles.emptyNotice}>Este alumno no tiene crews asociadas ni cargos pendientes.</div>
            )}
          </section>

          <section className={styles.group}>
            <div className={styles.sectionHeading}>
              <div><h2>Cargos a pagar</h2><p>Solo se muestran cargos pendientes de este alumno</p></div>
            </div>
            {payment.student && !payment.isLoadingCharges && (
              <>
                {payment.selectedCrews.length > 0 && (
                  <div className={styles.crewList}>
                    {payment.selectedCrews.map(({ relation, crew }) => (
                      <PaymentCrewCard
                        key={relation.id}
                        crewName={crew.name}
                        selections={payment.getSelectionsForCrew(relation, crew)}
                        selectedChargeIds={payment.selectedChargeIds}
                        onToggleCharge={payment.toggleCharge}
                        onRemove={() => payment.removeCrew(relation.id)}
                        onSelectPeriods={() => openPeriods(relation, crew)}
                        onGenerateCharges={() => setDialog({ type: "generate" })}
                      />
                    ))}
                  </div>
                )}
                {generalChargeSelections.length > 0 && (
                  <div className={styles.crewList}>
                    <PaymentCrewCard
                      crewName="Cargos generales"
                      selections={generalChargeSelections}
                      selectedChargeIds={payment.selectedChargeIds}
                      onToggleCharge={payment.toggleCharge}
                      onSelectPeriods={() => undefined}
                      onGenerateCharges={() => undefined}
                      showActions={false}
                    />
                  </div>
                )}
                {payment.selectedCrews.length === 0 && generalChargeSelections.length === 0 && !payment.chargesError && (
                  <div className={styles.emptyCrew}>
                    <span className={styles.emptyIcon}><LuReceipt size={20} /></span>
                    <div>
                      <strong>{payment.availableCrews.length ? "Agregá una crew para comenzar" : "Este alumno no tiene cargos pendientes"}</strong>
                      <p>{payment.availableCrews.length ? "Al agregar una crew vas a ver sus cargos pendientes." : "Los cargos pendientes se mostrarán aquí cuando existan."}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          <section className={styles.group}>
            <div className={styles.sectionHeading}>
              <div><h2>Descuentos</h2><p>Elegí los descuentos activos que se aplican a este pago</p></div>
            </div>
            <div className={styles.discountRow}>
              <div className={styles.discountInfo}>
                <span className={styles.discountIcon}><LuTag size={17} /></span>
                <div>
                  <strong>Descuento</strong>
                  <small>{payment.discountAmount ? paymentCurrency.format(payment.discountAmount) + " aplicado" : "Sin descuento aplicado"}</small>
                </div>
              </div>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={() => {
                  setDiscountDraft(payment.selectedDiscountIds);
                  setDialog({ type: "discount" });
                }}
              >
                {payment.selectedDiscounts.length ? "Editar descuentos" : "Agregar descuento"}
              </button>
            </div>
            {payment.discountError && <p className={styles.error} role="alert">{payment.discountError}</p>}
          </section>

          <section className={styles.group}>
            <div className={styles.sectionHeading}>
              <div><h2>Método de pago</h2><p>Elegí cómo se recibió el pago</p></div>
            </div>
            <div className={styles.methods}>
              <button
                type="button"
                className={payment.method === 0 ? styles.methodActive : styles.method}
                onClick={() => payment.setMethod(0)}
              >
                <span className={styles.methodMark}>$</span>
                <span><strong>Efectivo</strong><small>Pago en efectivo</small></span>
                <span className={styles.radio} />
              </button>
              <button
                type="button"
                className={payment.method === 1 ? styles.methodActive : styles.method}
                onClick={() => payment.setMethod(1)}
              >
                <LuCreditCard size={20} />
                <span><strong>Transferencia</strong><small>Transferencia bancaria</small></span>
                <span className={styles.radio} />
              </button>
            </div>
            {payment.method === 1 && (
              <label className={styles.field}>
                <span>Referencia de transacción <small>(opcional)</small></span>
                <input
                  className={styles.control}
                  value={payment.transactionReference}
                  onChange={(event) => payment.setTransactionReference(event.target.value)}
                  placeholder="Número o referencia"
                />
              </label>
            )}
            <label className={styles.field}>
              <span>Notas <small>(opcional)</small></span>
              <textarea
                className={styles.control}
                value={payment.notes}
                onChange={(event) => payment.setNotes(event.target.value)}
                placeholder="Agregar una nota"
                rows={2}
              />
            </label>
          </section>

          {payment.submitError && <p className={styles.error} role="alert">{payment.submitError}</p>}
          {payment.successMessage && (
            <p className={styles.success} role="status">
              {payment.successMessage} <Link to="/payments">Volver al listado de pagos</Link>
            </p>
          )}
          <button
            className={styles.saveButton}
            type="submit"
            disabled={payment.isLoading || payment.isLoadingCharges || payment.isSubmitting || !!payment.error || !payment.student || payment.selectedCharges.length === 0 || !!payment.discountError || !!payment.successMessage}
          >
            <span>{payment.isSubmitting ? "Registrando..." : "Guardar pago"}</span>
            <strong>{paymentCurrency.format(payment.paymentAmount)}</strong>
          </button>
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
