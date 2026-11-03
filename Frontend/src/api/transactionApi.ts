import { apiFetch, apiFetchVoid } from "./client";
import type {
  CreateCashMovementRequest,
  CashMovement,
  UpdateCashMovementRequest,
} from "../features/cashRegister/types/cashRegister";

export function getTransactions(filter: TransactionFilter = {}) {
  const query = new URLSearchParams();
  if (filter.cashRegisterId !== undefined) query.set("cashRegisterId", String(filter.cashRegisterId));
  if (filter.categoryId !== undefined) query.set("categoryId", String(filter.categoryId));
  if (filter.type !== undefined) query.set("type", String(filter.type));
  if (filter.method !== undefined) query.set("method", String(filter.method));
  if (filter.createdFromUtc) query.set("createdFromUtc", filter.createdFromUtc);
  if (filter.createdToUtc) query.set("createdToUtc", filter.createdToUtc);
  const search = query.size > 0 ? `?${query.toString()}` : "";
  return apiFetch<CashMovement[]>(`/api/Transaction${search}`);
}

export function getTransaction(id: number) {
  return apiFetch<CashMovement>(`/api/Transaction/${id}`);
}

export function createTransaction(request: CreateCashMovementRequest) {
  return apiFetch<CashMovement>("/api/Transaction", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function updateTransaction(id: number, request: UpdateCashMovementRequest) {
  return apiFetch<CashMovement>(`/api/Transaction/${id}`, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}

export function deleteTransaction(id: number) {
  return apiFetchVoid(`/api/Transaction/${id}`, { method: "DELETE" });
}

export interface TransactionFilter {
  cashRegisterId?: number;
  categoryId?: number;
  type?: 0 | 1;
  method?: 0 | 1;
  createdFromUtc?: string;
  createdToUtc?: string;
}
