import { apiFetch } from "./client";
import type { CreatePaymentRequest, Payment } from "../types/payment/payment";

export function getPayments() {
  return apiFetch<Payment[]>("/api/Payment");
}

export function createPayment(request: CreatePaymentRequest) {
  return apiFetch<Payment>("/api/Payment", {
    method: "POST",
    body: JSON.stringify(request),
  });
}