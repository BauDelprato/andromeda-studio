import type { CashMonthlyFilters } from "../types/cashRegisterHistory";

// Índice 0 = domingo, igual que Date#getUTCDay().
export const WEEKDAY_NAMES = Array.from({ length: 7 }, (_, index) =>
  new Intl.DateTimeFormat("es-AR", { weekday: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(2024, 0, 7 + index)),
  ),
);

export const DEFAULT_MONTHLY_FILTERS: CashMonthlyFilters = {
  weekday: "all",
  minFinalBalance: null,
};
