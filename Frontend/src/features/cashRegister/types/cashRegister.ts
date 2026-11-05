import type { PaymentMethod } from "@/features/payments/types/payment";

export type { PaymentMethod };

export type MovementType = 0 | 1;

export interface CashCategory {
  id: number;
  name: string;
  description: string | null;
  systemCode: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CashMovement {
  id: number;
  cashRegisterId: number;
  categoryId: number;
  categoryName: string;
  paymentId: number | null;
  amount: number;
  type: MovementType;
  method: PaymentMethod;
  createdAt: string;
  notes: string | null;
}

export interface CashRegister {
  id: number;
  date: string;
  openedAt: string;
  closedAt: string | null;
  openingBalance: number;
  closingBalance: number | null;
}

export interface CashSession {
  id: number | null;
  date: string | null;
  isOpen: boolean;
  openedAt: string | null;
  openingAmount: number;
  closingAmount: number | null;
}

export interface CashSummary {
  balance: number;
  income: number;
  expenses: number;
}

export interface CreateCashMovementRequest {
  type: MovementType;
  categoryId: number;
  method: PaymentMethod;
  amount: number;
  notes?: string | null;
}

export interface CreateCashCategoryRequest {
  name: string;
  description?: string | null;
}

export interface UpdateCashMovementRequest {
  categoryId?: number;
  amount?: number;
  type?: MovementType;
  method?: PaymentMethod;
  notes?: string | null;
}

export interface CashMovementRow {
  id: number;
  movement: CashMovement;
}
