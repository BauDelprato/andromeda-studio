import { useEffect, useState } from "react";
import { getCrews } from "@/api/crewApi";
import { getDiscounts } from "@/api/discountApi";
import { getStudentCrews } from "@/api/studentCrewApi";
import type { Crew } from "@/features/crews/types/crew";
import type { StudentCrewResponse } from "@/features/crews/types/studentCrew";
import type { PaymentDiscount } from "@/features/payments/types/payment";

export function usePaymentRegistrationOptions() {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [studentCrews, setStudentCrews] = useState<StudentCrewResponse[]>([]);
  const [discounts, setDiscounts] = useState<PaymentDiscount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function loadOptions() {
      try {
        setIsLoading(true);
        setError(null);
        const [loadedCrews, loadedStudentCrews, loadedDiscounts] = await Promise.all([
          getCrews(),
          getStudentCrews(),
          getDiscounts(),
        ]);

        if (!isCurrent) return;
        setCrews(loadedCrews);
        setStudentCrews(loadedStudentCrews);
        setDiscounts(loadedDiscounts.filter((discount) => discount.isActive));
      } catch {
        if (isCurrent) setError("No se pudieron cargar crews y descuentos.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadOptions();
    return () => {
      isCurrent = false;
    };
  }, []);

  return { crews, studentCrews, discounts, isLoading, error };
}
