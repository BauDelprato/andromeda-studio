import type { Payment, PaymentMethod } from "@/features/payments/types/payment";

export type { PaymentMethod };

export type MovementType = 0 | 1;

export interface CashCategory {
  id: number;
  name: string;
  type: MovementType;
}

export interface CashMovement {
  id: number;
  date: string;
  type: MovementType;
  categoryId: number;
  reason: string;
  method: PaymentMethod;
  amount: number;
  notes: string | null;
  transactionReference: string | null;
}

export interface CashSession {
  isOpen: boolean;
  openedAt: string | null;
  openingAmount: number;
}

export interface CashSummary {
  balance: number;
  income: number;
  expenses: number;
}

export interface CreateCashMovementRequest {
  date: string;
  type: MovementType;
  categoryId: number;
  reason: string;
  method: PaymentMethod;
  amount: number;
  notes?: string | null;
  transactionReference?: string | null;
}

export interface CreateCashCategoryRequest {
  name: string;
  type: MovementType;
}

export interface CashMovementRow {
  id: number;
  payment: Payment;
  studentName: string;
}
