import { useEffect, useState } from "react";
import { getStudents } from "@/api/studentApi";
import type { Student } from "@/types/student/student";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadStudents() {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getStudents();

      setStudents(data);
    } catch (error) {
      console.error("Error loading students:", error);
      setError("No se pudieron cargar los alumnos.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  return {
    students,
    isLoading,
    error,
    reload: loadStudents,
  };
}