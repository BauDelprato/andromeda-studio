import { apiFetch } from "./client";
import type { Charge } from "@/features/payments/types/charge";

export function getCharges() {
  return apiFetch<Charge[]>("/api/Charge");
}

export function getChargesByStudent(studentId: number) {
  return apiFetch<Charge[]>("/api/Charge/student/" + studentId);
}
