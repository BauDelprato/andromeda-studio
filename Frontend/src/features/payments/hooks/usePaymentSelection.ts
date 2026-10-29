import { useState } from "react";
import type { Crew } from "@/features/crews/types/crew";
import type { StudentCrewResponse } from "@/features/crews/types/studentCrew";
import type {
  PaymentCharge,
  PaymentChargeSelection,
  PaymentDiscount,
} from "@/features/payments/types/payment";
import { calculateDiscountAmount, roundToCents } from "@/features/payments/utils/paymentAmounts";

interface AvailableCrew {
  relation: StudentCrewResponse;
  crew: Crew;
}

interface UsePaymentSelectionOptions {
  studentCharges: PaymentCharge[];
  availableCrews: AvailableCrew[];
  discounts: PaymentDiscount[];
  onSelectionChange: () => void;
}

export function usePaymentSelection({
  studentCharges,
  availableCrews,
  discounts,
  onSelectionChange,
}: UsePaymentSelectionOptions) {
  const [selectedCrewIds, setSelectedCrewIds] = useState<number[]>([]);
  const [selectedChargeIds, setSelectedChargeIds] = useState<number[]>([]);
  const [selectedDiscountIds, setSelectedDiscountIds] = useState<number[]>([]);

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

  function getSelectionsForCrew(relation: StudentCrewResponse, crew: Crew) {
    return studentCharges
      .filter((charge) => charge.studentCrewId === relation.id)
      .map((charge) => ({ charge, crewName: crew.name }));
  }

  function resetSelection() {
    setSelectedCrewIds([]);
    setSelectedChargeIds([]);
    setSelectedDiscountIds([]);
  }

  function addCrew(studentCrewId: number) {
    const selection = availableCrews.find(({ relation }) => relation.id === studentCrewId);
    if (!selection || selectedCrewIds.includes(studentCrewId)) return;

    setSelectedCrewIds((current) => [...current, studentCrewId]);
    const chargeIds = getSelectionsForCrew(selection.relation, selection.crew).map(({ charge }) => charge.id);
    setSelectedChargeIds((current) => [...current, ...chargeIds.filter((id) => !current.includes(id))]);
    onSelectionChange();
  }

  function removeCrew(studentCrewId: number) {
    const chargeIds = studentCharges
      .filter((charge) => charge.studentCrewId === studentCrewId)
      .map((charge) => charge.id);
    setSelectedCrewIds((current) => current.filter((id) => id !== studentCrewId));
    setSelectedChargeIds((current) => current.filter((id) => !chargeIds.includes(id)));
    onSelectionChange();
  }

  function toggleCharge(chargeId: number) {
    setSelectedChargeIds((current) => current.includes(chargeId)
      ? current.filter((id) => id !== chargeId)
      : [...current, chargeId]);
    onSelectionChange();
  }

  function setChargesSelected(chargeIds: number[], selected: boolean) {
    setSelectedChargeIds((current) => selected
      ? [...current, ...chargeIds.filter((id) => !current.includes(id))]
      : current.filter((id) => !chargeIds.includes(id)));
    onSelectionChange();
  }

  function setDiscountSelection(discountIds: number[]) {
    setSelectedDiscountIds(discountIds);
    onSelectionChange();
  }

  return {
    selectedCrewIds,
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
    resetSelection,
    addCrew,
    removeCrew,
    toggleCharge,
    setChargesSelected,
    setDiscountSelection,
  };
}
