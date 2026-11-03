const cashDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

const cashLongDateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatCashDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Sin definir" : cashDateFormatter.format(date);
}

export function formatCashLongDate(value: Date) {
  return cashLongDateFormatter.format(value);
}

export function toLocalDateTimeInput(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}
