import { useEffect, useState } from "react";
import { getChargesByStudent } from "@/api/chargeApi"; 
import type { PaymentCharge } from "@/features/payments/types/payment";

export function useStudentPaymentHistory(studentId: string | undefined) {
  const [charges, setCharges] = useState<PaymentCharge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    const id = Number(studentId);

    if (!id || isNaN(id)) return;

    async function fetchHistory() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getChargesByStudent(id);
        if (isCurrent) {
          const sorted = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setCharges(sorted);
        }
      } catch (err) {
        if (isCurrent) setError("No se pudo cargar el historial de pagos.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    fetchHistory();
    return () => { isCurrent = false; };
  }, [studentId]);

  return { charges, isLoading, error };
}