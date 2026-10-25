import { useEffect, useMemo, useRef, useState } from "react";
import { getChargesByStudent } from "@/api/chargeApi";
import { getCrews } from "@/api/crewApi";
import { getDiscounts } from "@/api/discountApi";
import { createPayment } from "@/api/paymentApi";
import { getStudentCrews } from "@/api/studentCrewApi";
import { useStudents } from "@/features/students/hooks/useStudents";
import type { Student } from "@/features/students/types/student";
import type { Crew } from "@/features/crews/types/crew";
import type { StudentCrewResponse } from "@/features/crews/types/studentCrew";
import type { PaymentCharge, PaymentChargeSelection, PaymentDiscount, PaymentMethod } from "@/features/payments/types/payment";
import { allocatePaymentAmounts, calculateDiscountAmount, roundToCents } from "@/features/payments/utils/paymentAmounts";

function getCurrentLocalDateTime() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function usePaymentRegistration() {
  const { students, isLoading: isLoadingStudents, error: studentsError } = useStudents();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [studentCrews, setStudentCrews] = useState<StudentCrewResponse[]>([]);
  const [discounts, setDiscounts] = useState<PaymentDiscount[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [studentCharges, setStudentCharges] = useState<PaymentCharge[]>([]);
  const [isLoadingCharges, setIsLoadingCharges] = useState(false);
  const [chargesError, setChargesError] = useState<string | null>(null);
  const [selectedCrewIds, setSelectedCrewIds] = useState<number[]>([]);
  const [selectedChargeIds, setSelectedChargeIds] = useState<number[]>([]);
  const [selectedDiscountIds, setSelectedDiscountIds] = useState<number[]>([]);
  const [paymentDate, setPaymentDate] = useState(getCurrentLocalDateTime);
  const [method, setMethod] = useState<PaymentMethod>(0);
  const [notes, setNotes] = useState("");
  const [transactionReference, setTransactionReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const latestChargeRequest = useRef(0);

  useEffect(() => {
    let isCurrent = true;

    async function loadOptions() {
      try {
        setIsLoadingOptions(true);
        setOptionsError(null);
        const [loadedCrews, loadedStudentCrews, loadedDiscounts] = await Promise.all([
          getCrews(),
          getStudentCrews(),
          getDiscounts(),
        ]);

        if (!isCurrent) return;
        setCrews(loadedCrews);
        setStudentCrews(loadedStudentCrews);
        setDiscounts(loadedDiscounts.filter((discount) => discount.isActive));
      } catch {
        if (isCurrent) setOptionsError("No se pudieron cargar crews y descuentos.");
      } finally {
        if (isCurrent) setIsLoadingOptions(false);
      }
    }

    loadOptions();
    return () => {
      isCurrent = false;
    };
  }, []);

  const availableCrews = useMemo(() => {
    if (!student) return [];

    return studentCrews
      .filter((relation) => relation.studentId === student.id)
      .flatMap((relation) => {
        const crew = crews.find((item) => item.id === relation.crewId);
        return crew ? [{ relation, crew }] : [];
      });
  }, [crews, student, studentCrews]);

  const selectedCrews = availableCrews.filter(({ relation }) => selectedCrewIds.includes(relation.id));
  const generalCharges = studentCharges.filter((charge) => charge.studentCrewId === null);
  const selectedDiscounts = discounts.filter((discount) => selectedDiscountIds.includes(discount.id));
  const selectedCharges: PaymentChargeSelection[] = studentCharges
    .filter((charge) => selectedChargeIds.includes(charge.id))
    .map((charge) => {
      const relation = availableCrews.find((item) => item.relation.id === charge.studentCrewId);
      const crewName = relation?.crew.name ?? "Cargos generales";
      return { charge, crewName };
    });
  const subtotal = roundToCents(selectedCharges.reduce((total, selection) => total + selection.charge.amount, 0));
  const discountAmount = calculateDiscountAmount(
    selectedCharges.map((selection) => selection.charge),
    selectedDiscounts,
  );
  const paymentAmount = roundToCents(Math.max(0, subtotal - discountAmount));
  const discountError = discountAmount > subtotal
    ? "El descuento supera el importe de los cargos seleccionados."
    : subtotal > 0 && discountAmount === subtotal
      ? "El total a pagar debe ser mayor que cero."
      : null;

  async function selectStudent(selectedStudent: Student) {
    latestChargeRequest.current += 1;
    const requestId = latestChargeRequest.current;
    setStudent(selectedStudent);
    setStudentCharges([]);
    setSelectedCrewIds([]);
    setSelectedChargeIds([]);
    setSelectedDiscountIds([]);
    setChargesError(null);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      setIsLoadingCharges(true);
      const charges = await getChargesByStudent(selectedStudent.id);
      if (requestId === latestChargeRequest.current) {
        setStudentCharges(charges.filter((charge) => charge.status === 0));
      }
    } catch {
      if (requestId === latestChargeRequest.current) {
        setChargesError("No se pudieron cargar los cargos pendientes del alumno.");
      }
    } finally {
      if (requestId === latestChargeRequest.current) setIsLoadingCharges(false);
    }
  }

  function getSelectionsForCrew(relation: StudentCrewResponse, crew: Crew) {
    return studentCharges
      .filter((charge) => charge.studentCrewId === relation.id)
      .map((charge) => ({ charge, crewName: crew.name }));
  }

  function addCrew(studentCrewId: number) {
    const selection = availableCrews.find(({ relation }) => relation.id === studentCrewId);
    if (!selection || selectedCrewIds.includes(studentCrewId)) return;

    setSelectedCrewIds((current) => [...current, studentCrewId]);
    const chargeIds = getSelectionsForCrew(selection.relation, selection.crew).map(({ charge }) => charge.id);
    setSelectedChargeIds((current) => [...current, ...chargeIds.filter((id) => !current.includes(id))]);
    setSubmitError(null);
    setSuccessMessage(null);
  }

  function removeCrew(studentCrewId: number) {
    const chargeIds = studentCharges
      .filter((charge) => charge.studentCrewId === studentCrewId)
      .map((charge) => charge.id);
    setSelectedCrewIds((current) => current.filter((id) => id !== studentCrewId));
    setSelectedChargeIds((current) => current.filter((id) => !chargeIds.includes(id)));
    setSubmitError(null);
    setSuccessMessage(null);
  }

  function toggleCharge(chargeId: number) {
    setSelectedChargeIds((current) => current.includes(chargeId)
      ? current.filter((id) => id !== chargeId)
      : [...current, chargeId]);
    setSubmitError(null);
    setSuccessMessage(null);
  }

  function setChargesSelected(chargeIds: number[], selected: boolean) {
    setSelectedChargeIds((current) => selected
      ? [...current, ...chargeIds.filter((id) => !current.includes(id))]
      : current.filter((id) => !chargeIds.includes(id)));
    setSubmitError(null);
    setSuccessMessage(null);
  }

  function setDiscountSelection(discountIds: number[]) {
    setSelectedDiscountIds(discountIds);
    setSubmitError(null);
    setSuccessMessage(null);
  }

  function updatePaymentDate(value: string) {
    setPaymentDate(value);
    setSubmitError(null);
    setSuccessMessage(null);
  }

  function updateMethod(value: PaymentMethod) {
    setMethod(value);
    setSubmitError(null);
    setSuccessMessage(null);
  }

  function updateNotes(value: string) {
    setNotes(value);
    setSubmitError(null);
    setSuccessMessage(null);
  }

  function updateTransactionReference(value: string) {
    setTransactionReference(value);
    setSubmitError(null);
    setSuccessMessage(null);
  }

  async function submitPayment() {
    setSubmitError(null);
    setSuccessMessage(null);

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

  return {
    students,
    discounts,
    isLoading: isLoadingStudents || isLoadingOptions,
    isLoadingCharges,
    isSubmitting,
    error: studentsError ?? optionsError,
    chargesError,
    submitError,
    successMessage,
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
