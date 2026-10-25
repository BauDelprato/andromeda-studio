import type { CreateChargePaymentRequest, PaymentCharge, PaymentDiscount } from "@/features/payments/types/payment";

export function roundToCents(value: number) {
  const cents = value * 100;
  const wholeCents = Math.floor(cents);
  const fraction = cents - wholeCents;
  const isHalfCent = Math.abs(fraction - 0.5) < 0.000001;
  const roundedCents = isHalfCent
    ? (wholeCents % 2 === 0 ? wholeCents : wholeCents + 1)
    : Math.round(cents);

  return roundedCents / 100;
}

export function calculateDiscountAmount(charges: PaymentCharge[], discounts: PaymentDiscount[]) {
  if (charges.length === 0) return 0;

  const baseAmount = charges.reduce((total, charge) => total + charge.amount, 0);

  return roundToCents(discounts.reduce((total, discount) => {
    const discountAmount = discount.type === 0
      ? baseAmount * discount.discountAmount / 100
      : discount.discountAmount;

    return total + roundToCents(discountAmount);
  }, 0));
}

export function allocatePaymentAmounts(charges: PaymentCharge[], paymentAmount: number): CreateChargePaymentRequest[] {
  if (charges.length === 0) return [];

  const chargeCents = charges.map((charge) => Math.round(charge.amount * 100));
  const totalChargeCents = chargeCents.reduce((total, amount) => total + amount, 0);
  const paymentCents = Math.min(Math.max(0, Math.round(paymentAmount * 100)), totalChargeCents);

  if (totalChargeCents === 0) {
    return charges.map((charge) => ({ chargeId: charge.id, amount: 0 }));
  }

  const exactAllocations = chargeCents.map((amount) => paymentCents * amount / totalChargeCents);
  const allocatedCents = exactAllocations.map(Math.floor);
  let remainingCents = paymentCents - allocatedCents.reduce((total, amount) => total + amount, 0);
  const priority = exactAllocations
    .map((amount, index) => ({ index, remainder: amount - allocatedCents[index] }))
    .sort((left, right) => right.remainder - left.remainder);

  for (const item of priority) {
    if (remainingCents === 0) break;
    if (allocatedCents[item.index] < chargeCents[item.index]) {
      allocatedCents[item.index] += 1;
      remainingCents -= 1;
    }
  }

  return charges.map((charge, index) => ({
    chargeId: charge.id,
    amount: allocatedCents[index] / 100,
  }));
}
