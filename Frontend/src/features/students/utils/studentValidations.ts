import type { EditStudentFormData, StudentFormData } from "@/features/students/types/studentFormTypes";

export const isValidName = (name: string): boolean => {
  const nameRegex = /^[\p{L}\p{M}\s'-]+$/u;
  return nameRegex.test(name.trim());
};

export const isValidDni = (dni: string): boolean => {
  const dniRegex = /^\d{8}$/;
  return dniRegex.test(dni.trim());
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  if (!phone.trim()) return true;
  const phoneRegex = /^[\d\s()+-]+$/;
  return phoneRegex.test(phone.trim());
};

export const validateStudentForm = (form: StudentFormData | EditStudentFormData): string | null => {
  if (!form.firstName.trim() || !form.lastName.trim() || !form.dni.trim() || !form.email.trim()) {
    return "Por favor completa Nombre, Apellido, DNI y Correo.";
  }
  if (!isValidName(form.firstName) || !isValidName(form.lastName)) return "El nombre y apellido solo pueden contener letras válidas.";
  if (!isValidDni(form.dni)) return "El DNI debe ser válido.";
  if (!isValidEmail(form.email)) return "El formato del correo electrónico no es válido.";
  if (form.phone && !isValidPhone(form.phone)) return "El teléfono contiene caracteres inválidos.";
  return null;
};