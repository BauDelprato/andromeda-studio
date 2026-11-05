import type { MovementType, PaymentMethod } from "../types/cashRegister";

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  0: "Ingreso",
  1: "Gasto",
};

export const MOVEMENT_TYPE_FILTERS: { label: string; value: MovementType | "all" }[] = [
  { label: "Todos los tipos", value: "all" },
  { label: "Ingreso", value: 0 },
  { label: "Gasto", value: 1 },
];

export const CASH_PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  0: "Efectivo",
  1: "Transferencia",
};
