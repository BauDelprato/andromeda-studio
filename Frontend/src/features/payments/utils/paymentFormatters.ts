export const paymentCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

export function formatBillingPeriod(value: string | null) {
  if (!value) return "Sin período";
  const date = new Date(value + "T00:00:00");
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" }).format(date);
}

export function formatPaymentDate(value: string) {
  if (!value) return "Sin definir";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin definir";
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "short", timeStyle: "short" }).format(date);
}
