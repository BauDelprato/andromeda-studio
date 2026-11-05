import { apiFetch, apiFetchVoid } from "./client";
import type { CashCategory, CreateCashCategoryRequest } from "../features/cashRegister/types/cashRegister";

export function getCategories() {
  return apiFetch<CashCategory[]>("/api/Category");
}

export function getCategory(id: number) {
  return apiFetch<CashCategory>(`/api/Category/${id}`);
}

export function createCategory(request: CreateCashCategoryRequest) {
  return apiFetch<CashCategory>("/api/Category", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function updateCategory(id: number, request: UpdateCategoryRequest) {
  return apiFetch<CashCategory>(`/api/Category/${id}`, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}

export function deleteCategory(id: number) {
  return apiFetchVoid(`/api/Category/${id}`, { method: "DELETE" });
}

export interface UpdateCategoryRequest {
  name?: string;
  isActive?: boolean;
  description?: string | null;
}
