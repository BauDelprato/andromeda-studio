import { useCallback, useEffect, useMemo, useState } from "react";
import { getPayments } from "@/api/paymentApi";
import { getStudents } from "@/api/studentApi";
import type { Payment } from "@/features/payments/types/payment";
import type { Student } from "@/features/students/types/student";
import type { CashMovementRow } from "../types/cashRegister";

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useCashRegister() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const today = useMemo(() => getLocalDateKey(new Date()), []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [loadedPayments, loadedStudents] = await Promise.all([getPayments(), getStudents()]);
      setPayments(loadedPayments);
      setStudents(loadedStudents);
    } catch {
      setPayments([]);
      setStudents([]);
      setError("No se pudo cargar la caja diaria. Verificá la conexión con el backend.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const rows = useMemo<CashMovementRow[]>(() => {
    const studentsById = new Map(students.map((student) => [student.id, student]));
    return payments
      .filter((payment) => {
        const paymentDate = new Date(payment.date);
        return !Number.isNaN(paymentDate.getTime()) && getLocalDateKey(paymentDate) === today;
      })
      .map((payment) => {
        const student = studentsById.get(payment.studentId);
        return {
          id: payment.id,
          payment,
          studentName: student ? `${student.firstName} ${student.lastName}`.trim() : `Alumno #${payment.studentId}`,
        };
      })
      .sort((first, second) => second.payment.date.localeCompare(first.payment.date));
  }, [payments, students, today]);

  const income = useMemo(
    () => rows.reduce((total, row) => total + row.payment.amount, 0),
    [rows],
  );

  return { rows, income, isLoading, error, reload };
}
