import type { Charge } from "../types/charge";

const billingPeriodFormatter = new Intl.DateTimeFormat("es-AR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatBillingPeriod(value: string | null) {
  if (!value) return "Sin período";
  const date = new Date(value + "T00:00:00Z");
  return Number.isNaN(date.getTime())
    ? "Sin período"
    : billingPeriodFormatter.format(date);
}

export function getPeriodParts(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value.length === 10 ? value + "T00:00:00Z" : value);
  if (Number.isNaN(date.getTime())) return null;
  return { month: String(date.getUTCMonth()), year: String(date.getUTCFullYear()) };
}

export function getChargeBillingDate(charge: Charge) {
  return charge.billingPeriod ?? charge.createdAt;
}
