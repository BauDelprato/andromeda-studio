import { apiFetch, apiFetchVoid } from "./client";
import type { CashRegister } from "../features/cashRegister/types/cashRegister";

export function getCashRegisters() {
  return apiFetch<CashRegister[]>("/api/CashRegister");
}

export function getCashRegister(id: number) {
  return apiFetch<CashRegister>(`/api/CashRegister/${id}`);
}

export function createCashRegister() {
  return apiFetch<CashRegister>("/api/CashRegister", { method: "POST" });
}

export function closeCashRegister(id: number) {
  return apiFetch<CashRegister>(`/api/CashRegister/${id}/close`, { method: "POST" });
}

export function updateCashRegister(id: number, request: UpdateCashRegisterRequest) {
  return apiFetch<CashRegister>(`/api/CashRegister/${id}`, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}

export function deleteCashRegister(id: number) {
  return apiFetchVoid(`/api/CashRegister/${id}`, { method: "DELETE" });
}

export interface UpdateCashRegisterRequest {
  date?: string;
  openedAt?: string;
  closedAt?: string | null;
  openingBalance?: number;
}
