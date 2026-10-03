import { useState } from "react";
import { apiFetch } from "@/api/client";
import type { StudentFormData } from "@/types/student/studentFormTypes";

export function useUpdateStudent(studentId: number) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const updateStudent = async (studentData: StudentFormData): Promise<boolean> => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      await apiFetch(`/api/Students/${studentId}`, {
        method: "PATCH",
        body: JSON.stringify({ id: studentId, ...studentData }),
      });
      setUpdateSuccess(true);
      return true;
    } catch (err: any) {
      setUpdateError(err.message || "Error al actualizar el alumno.");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateStudent, isUpdating, updateError, updateSuccess, setUpdateSuccess };
}