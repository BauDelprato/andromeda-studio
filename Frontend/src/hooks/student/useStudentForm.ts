import { useState, type FormEvent } from "react";
import { type StudentFormData, emptyStudentForm } from "@/types/student/studentFormTypes";
import { useCreateStudent } from "./useCreateStudent";
import { isValidDni, isValidName, isValidPhone } from "@/utils/studentValidations";

export function useStudentForm() {
  const [form, setForm] = useState<StudentFormData>(emptyStudentForm);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const { submitStudent, isLoading, error: apiError, success, setSuccess } = useCreateStudent();

  const updateField = (field: keyof StudentFormData, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (success) setSuccess(false);
    if (validationError) setValidationError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!form.firstName || !form.lastName || !form.dni || !form.email) {
      setValidationError("Por favor completa Nombre, Apellido, DNI y Correo.");
      return;
    }

    if (!isValidName(form.firstName) || !isValidName(form.lastName)) {
      setValidationError("El nombre y apellido solo pueden contener letras.");
      return;
    }

    if (!isValidDni(form.dni)) {
      setValidationError("El DNI debe ser válido (8 dígitos).");
      return;
    }
    if (!isValidPhone(form.phone)) {
      setValidationError("El teléfono debe ser válido.");
      return;
    }

    const isSuccess = await submitStudent(form);
    if (isSuccess) {
        setForm(emptyStudentForm);
    }
  };

  return {
    form,
    updateField,
    handleSubmit,
    isLoading,
    error: validationError || apiError,
    success
  };
}