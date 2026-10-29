import { useRef, useState } from "react";
import { getChargesByStudent } from "@/api/chargeApi";
import type { Student } from "@/features/students/types/student";
import type { PaymentCharge } from "@/features/payments/types/payment";

export function useStudentPaymentCharges() {
  const [student, setStudent] = useState<Student | null>(null);
  const [studentCharges, setStudentCharges] = useState<PaymentCharge[]>([]);
  const [isLoadingCharges, setIsLoadingCharges] = useState(false);
  const [chargesError, setChargesError] = useState<string | null>(null);
  const latestChargeRequest = useRef(0);

  async function selectStudent(selectedStudent: Student) {
    latestChargeRequest.current += 1;
    const requestId = latestChargeRequest.current;
    setStudent(selectedStudent);
    setStudentCharges([]);
    setChargesError(null);

    try {
      setIsLoadingCharges(true);
      const charges = await getChargesByStudent(selectedStudent.id);
      if (requestId === latestChargeRequest.current) {
        setStudentCharges(charges.filter((charge) => charge.status === 0));
      }
    } catch {
      if (requestId === latestChargeRequest.current) {
        setChargesError("No se pudieron cargar los cargos pendientes del alumno.");
      }
    } finally {
      if (requestId === latestChargeRequest.current) setIsLoadingCharges(false);
    }
  }

  return { student, studentCharges, isLoadingCharges, chargesError, selectStudent };
}
