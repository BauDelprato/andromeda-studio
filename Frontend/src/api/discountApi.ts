import { apiFetch } from "./client";
import type { PaymentDiscount } from "@/features/payments/types/payment";

export function getDiscounts() {
  return apiFetch<PaymentDiscount[]>("/api/Discount");
}
