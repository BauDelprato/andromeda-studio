import { useState } from "react";
import { createStudent } from "../api/studentApi";
import type { StudentFormData } from "../pages/student/studentFormTypes";

export const useCreateStudent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitStudent = async (form: StudentFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const nameParts = form.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const payload = {
        firstName: firstName,
        lastName: lastName,
        dni: form.dni,
        phone: form.phone,
        email: form.email,
        fitnessCertificate: true,
        notes: form.healthNotes || null,
      };

      await createStudent(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { submitStudent, isLoading, error, success };
};