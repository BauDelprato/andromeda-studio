import type { Charge } from "@/features/payments/types/charge";

export type { ChargeStatus, ChargeType } from "@/features/payments/types/charge";

export type PaymentMethod = 0 | 1;
export type DiscountType = 0 | 1;

export type PaymentCharge = Charge;

export interface PaymentDiscount {
  id: number;
  name: string;
  type: DiscountType;
  discountAmount: number;
  isActive: boolean;
}

export interface PaymentChargeSelection {
  charge: PaymentCharge;
  crewName: string;
}

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  discountAmount: number;
  date: string;
  method: PaymentMethod;
  notes: string | null;
  transactionReference: string | null;
  createdAt: string;
}

export interface CreateChargePaymentRequest {
  chargeId: number;
  amount: number;
}

export interface CreatePaymentRequest {
  studentId: number;
  amount: number;
  discountAmount: number;
  date: string;
  method: PaymentMethod;
  notes?: string | null;
  transactionReference?: string | null;
  discountIds: number[];
  charges: CreateChargePaymentRequest[];
}
