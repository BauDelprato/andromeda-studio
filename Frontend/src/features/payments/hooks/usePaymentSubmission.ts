import { useState } from "react";
import { createPayment } from "@/api/paymentApi";
import type { Student } from "@/features/students/types/student";
import type { PaymentChargeSelection, PaymentMethod } from "@/features/payments/types/payment";
import { allocatePaymentAmounts } from "@/features/payments/utils/paymentAmounts";

interface SubmitPaymentInput {
  student: Student | null;
  selectedCharges: PaymentChargeSelection[];
  selectedDiscountIds: number[];
  paymentAmount: number;
  discountAmount: number;
  discountError: string | null;
  paymentDate: string;
  method: PaymentMethod;
  notes: string;
  transactionReference: string;
}

export function usePaymentSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function clearFeedback() {
    setSubmitError(null);
    setSuccessMessage(null);
  }

  async function submitPayment({
    student,
    selectedCharges,
    selectedDiscountIds,
    paymentAmount,
    discountAmount,
    discountError,
    paymentDate,
    method,
    notes,
    transactionReference,
  }: SubmitPaymentInput) {
    clearFeedback();

    if (!student || selectedCharges.length === 0) {
      setSubmitError("Seleccioná un alumno y al menos un cargo pendiente.");
      return false;
    }

    if (!paymentDate || discountError) {
      setSubmitError(discountError ?? "Ingresá una fecha y hora válidas.");
      return false;
    }

    try {
      setIsSubmitting(true);
      await createPayment({
        studentId: student.id,
        amount: paymentAmount,
        discountAmount,
        date: new Date(paymentDate).toISOString(),
        method,
        notes: notes.trim() || null,
        transactionReference: method === 1 ? transactionReference.trim() || null : null,
        discountIds: selectedDiscountIds,
        charges: allocatePaymentAmounts(
          selectedCharges.map((selection) => selection.charge),
          paymentAmount,
        ),
      });
      setSuccessMessage("El pago se registró correctamente.");
      return true;
    } catch {
      setSubmitError("No se pudo registrar el pago. Revisá los datos e intentá nuevamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { isSubmitting, submitError, successMessage, clearFeedback, submitPayment };
}
