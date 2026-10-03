import { useState } from "react";
import { apiFetch } from "@/api/client";

export function useStudentStatus() {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const toggleStudentStatus = async (studentId: number, currentStatus: boolean): Promise<boolean> => {
    setIsUpdatingStatus(true);
    setStatusError(null);
    const endpoint = currentStatus ? "deactivate" : "activate";

    try {
      await apiFetch(`/api/Students/${studentId}/${endpoint}`, {
        method: "PATCH",
      });
      return true;
    } catch (err: any) {
      setStatusError(err.message || "Error al cambiar el estado del alumno.");
      return false;
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return { toggleStudentStatus, isUpdatingStatus, statusError };
}