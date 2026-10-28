import { useMemo, useState } from "react";
import { useStudents } from "@/features/students/hooks/useStudents";
import type { PaymentMethod } from "@/features/payments/types/payment";
import { usePaymentRegistrationOptions } from "@/features/payments/hooks/usePaymentRegistrationOptions";
import { usePaymentSelection } from "@/features/payments/hooks/usePaymentSelection";
import { usePaymentSubmission } from "@/features/payments/hooks/usePaymentSubmission";
import { useStudentPaymentCharges } from "@/features/payments/hooks/useStudentPaymentCharges";

function getCurrentLocalDateTime() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function usePaymentRegistration() {
  const { students, isLoading: isLoadingStudents, error: studentsError } = useStudents();
  const {
    crews,
    studentCrews,
    discounts,
    isLoading: isLoadingOptions,
    error: optionsError,
  } = usePaymentRegistrationOptions();
  const [paymentDate, setPaymentDate] = useState(getCurrentLocalDateTime);
  const [method, setMethod] = useState<PaymentMethod>(0);
  const [notes, setNotes] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const submission = usePaymentSubmission();
  const { student, studentCharges, isLoadingCharges, chargesError, selectStudent: loadStudentCharges } =
    useStudentPaymentCharges();

  const availableCrews = useMemo(() => {
    if (!student) return [];

    return studentCrews
      .filter((relation) => relation.studentId === student.id)
      .flatMap((relation) => {
        const crew = crews.find((item) => item.id === relation.crewId);
        return crew ? [{ relation, crew }] : [];
      });
  }, [crews, student, studentCrews]);

  const paymentSelection = usePaymentSelection({
    studentCharges,
    availableCrews,
    discounts,
    onSelectionChange: submission.clearFeedback,
  });
  const {
    selectedChargeIds,
    selectedDiscountIds,
    selectedCrews,
    generalCharges,
    selectedDiscounts,
    selectedCharges,
    subtotal,
    discountAmount,
    paymentAmount,
    discountError,
    getSelectionsForCrew,
    addCrew,
    removeCrew,
    toggleCharge,
    setChargesSelected,
    setDiscountSelection,
  } = paymentSelection;

  async function selectStudent(selectedStudent: Parameters<typeof loadStudentCharges>[0]) {
    paymentSelection.resetSelection();
    submission.clearFeedback();
    await loadStudentCharges(selectedStudent);
  }

  function updatePaymentDate(value: string) {
    setPaymentDate(value);
    submission.clearFeedback();
  }

  function updateMethod(value: PaymentMethod) {
    setMethod(value);
    submission.clearFeedback();
  }

  function updateNotes(value: string) {
    setNotes(value);
    submission.clearFeedback();
  }

  function updateTransactionReference(value: string) {
    setTransactionReference(value);
    submission.clearFeedback();
  }

  async function submitPayment() {
    return submission.submitPayment({
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
    });
  }

  return {
    students,
    discounts,
    isLoading: isLoadingStudents || isLoadingOptions,
    isLoadingCharges,
    isSubmitting: submission.isSubmitting,
    error: studentsError ?? optionsError,
    chargesError,
    submitError: submission.submitError,
    successMessage: submission.successMessage,
    student,
    generalCharges,
    availableCrews,
    selectedCrews,
    selectedChargeIds,
    selectedDiscountIds,
    selectedDiscounts,
    selectedCharges,
    subtotal,
    discountAmount,
    discountError,
    paymentAmount,
    paymentDate,
    method,
    notes,
    transactionReference,
    setPaymentDate: updatePaymentDate,
    setMethod: updateMethod,
    setNotes: updateNotes,
    setTransactionReference: updateTransactionReference,
    selectStudent,
    addCrew,
    removeCrew,
    toggleCharge,
    setChargesSelected,
    setDiscountSelection,
    getSelectionsForCrew,
    submitPayment,
  };
}
