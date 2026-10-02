import { useEffect, useState } from "react";
import { getPayments } from "@/api/paymentApi";
import type { Payment } from "@/types/payment/payment";

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPayments() {
    try {
      setIsLoading(true);
      setError(null);
      setPayments(await getPayments());
    } catch (error) {
      console.error("Error loading payments:", error);
      setError("No se pudieron cargar los pagos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  return {
    payments,
    isLoading,
    error,
    reload: loadPayments,
  };
}