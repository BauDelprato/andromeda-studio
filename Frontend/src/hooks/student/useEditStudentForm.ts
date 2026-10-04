import { useState, useEffect, type FormEvent } from "react";
import type { Student } from "@/types/student/student";
import type { EditStudentFormData } from "@/types/student/studentFormTypes";
import { updateStudentApi, changeStudentStatusApi } from "@/api/studentApi";
import { validateStudentForm } from "@/utils/studentValidations";

export function useEditStudentForm(student: Student) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<EditStudentFormData>({
    firstName: student.firstName,
    lastName: student.lastName,
    dni: student.dni,
    email: student.email,
    phone: student.phone,
    fitnessCertificate: student.fitnessCertificate,
    notes: student.notes || "",
    isActive: student.isActive,
  });
  useEffect(() => {
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      dni: student.dni,
      email: student.email,
      phone: student.phone,
      fitnessCertificate: student.fitnessCertificate,
      notes: student.notes ?? "",
      isActive: student.isActive,
    });
    setError(null);
    setSuccess(false);
  }, [student]);

  const updateField = <K extends keyof EditStudentFormData>(field: K, value: EditStudentFormData[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleToggleStatus = () => {
    updateField("isActive", !form.isActive);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const validationError = validateStudentForm(form);
    if (validationError) {
      return setError(validationError);
    }

    setIsUpdating(true);
    try {
      await updateStudentApi(student.id, form);
      
      if (student.isActive !== form.isActive) {
        await changeStudentStatusApi(student.id, form.isActive);
      }

      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al actualizar el alumno.";
      setError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return { form, updateField, handleSubmit, handleToggleStatus, isUpdating, error, success };
}