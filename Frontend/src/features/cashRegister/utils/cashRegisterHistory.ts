import type { CashRegister } from "../types/cashRegister";

const registerDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

// register.date llega como "YYYY-MM-DD" (o ISO). Se interpreta siempre en UTC
// para que no se corra un día según la zona horaria del navegador.
export function getRegisterDateKey(register: CashRegister) {
  return register.date.slice(0, 10);
}

export function getRegisterDateParts(register: CashRegister) {
  const [year, month, day] = getRegisterDateKey(register).split("-").map(Number);
  return { year, month: month - 1, day };
}

export function formatRegisterDate(register: CashRegister) {
  const date = new Date(getRegisterDateKey(register) + "T00:00:00Z");
  return Number.isNaN(date.getTime()) ? "Sin definir" : registerDateFormatter.format(date);
}

export function buildDateKey(year: number, month: number, day: number) {
  return [year, String(month + 1).padStart(2, "0"), String(day).padStart(2, "0")].join("-");
}

export function getDaysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

export function getAvailableYears(registers: CashRegister[]) {
  const years = new Set<number>([new Date().getFullYear()]);
  registers.forEach((register) => years.add(getRegisterDateParts(register).year));
  return Array.from(years).sort((first, second) => second - first);
}

export function getRegisterWeekday(register: CashRegister) {
  return new Date(getRegisterDateKey(register) + "T00:00:00Z").getUTCDay();
}
