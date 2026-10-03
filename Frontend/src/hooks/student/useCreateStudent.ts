import { useState } from "react";
import { createStudent } from "../../api/studentApi";
import type { StudentFormData } from "../../types/student/studentFormTypes";

export function useCreateStudent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitStudent = async (studentData: StudentFormData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createStudent(studentData);
      setSuccess(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al intentar guardar el alumno.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitStudent, isLoading, error, success, setSuccess };
}