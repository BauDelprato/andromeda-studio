import { useState, type FormEvent } from "react";
import type { Student } from "@/types/student/student";
import type { StudentFormData } from "@/types/student/studentFormTypes";
import { useUpdateStudent } from "./useUpdateStudent";
import { useStudentStatus } from "./useStudentStatus";
import { isValidDni, isValidName, isValidPhone } from "@/utils/studentValidations";

export function useEditStudentForm(student: Student) {
  const { updateStudent, isUpdating, updateError, updateSuccess, setUpdateSuccess } = useUpdateStudent(student.id);
  
  const [form, setForm] = useState<StudentFormData>({
    firstName: student.firstName,
    lastName: student.lastName,
    dni: student.dni,
    email: student.email,
    phone: student.phone,
    fitnessCertificate: student.fitnessCertificate,
    notes: student.notes || "",
  });
  
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toggleStudentStatus, isUpdatingStatus, statusError } = useStudentStatus();

  const handleToggleStatus = async () => {
    const actionText = student.isActive ? "dar de baja" : "activar";
    if (window.confirm(`¿Estás seguro de que deseas ${actionText} a este alumno?`)) {
      const success = await toggleStudentStatus(student.id, student.isActive);
      if (success) {
        window.location.reload(); 
      }
    }
  };

  const updateField = (field: keyof StudentFormData, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (updateSuccess) setUpdateSuccess(false);
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
    await updateStudent(form);
  };

  return {
    form,
    updateField,
    handleSubmit,
    handleToggleStatus,
    isUpdating: isUpdating || isUpdatingStatus,
    error: validationError || updateError || statusError,
    success: updateSuccess
  };
}