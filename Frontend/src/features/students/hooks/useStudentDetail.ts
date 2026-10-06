import { useEffect, useState } from "react";
import { getStudentById } from "@/api/studentApi";
import type { Student } from "@/features/students/types/student";

export function useStudentDetail(id: string | undefined) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    const studentId = Number(id);

    async function loadStudent() {
      setStudent(null);
      setIsLoading(true);
      setError(null);

      if (!Number.isInteger(studentId) || studentId < 1) {
        setError("El identificador del alumno no es válido.");
        setIsLoading(false);
        return;
      }

      try {
        const result = await getStudentById(studentId);
        if (isCurrent) setStudent(result);
      } catch {
        if (isCurrent) setError("No se pudo cargar la información del alumno.");
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }

    loadStudent();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  return { student, isLoading, error };
}
