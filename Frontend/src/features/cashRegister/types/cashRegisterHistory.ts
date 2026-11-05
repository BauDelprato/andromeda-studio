import type { CashRegister } from "./cashRegister";

export interface CashRegisterMonthRow {
  id: number;
  register: CashRegister;
  income: number;
  expenses: number;
  finalBalance: number;
}

export interface CashMonthlyFilters {
  weekday: number | "all";
  minFinalBalance: number | null;
}
