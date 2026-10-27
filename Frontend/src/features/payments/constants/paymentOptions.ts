import type { ChargeStatus } from "../types/charge";

export const CHARGE_STATUS_LABELS: Record<ChargeStatus, string> = {
  0: "Pendiente",
  1: "Pagado",
  2: "Parcial",
  3: "Atrasado",
  4: "Cancelado",
};

export const CHARGE_STATUS_FILTERS: { label: string; value: ChargeStatus | "all" }[] = [
  { label: "Todos los estados", value: "all" },
  { label: "Pagado", value: 1 },
  { label: "Pendiente", value: 0 },
  { label: "Parcial", value: 2 },
  { label: "Atrasado", value: 3 },
  { label: "Cancelado", value: 4 },
];

export const MONTH_NAMES = Array.from({ length: 12 }, (_, index) =>
  new Intl.DateTimeFormat("es-AR", { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(2024, index, 1)),
  ),
);
