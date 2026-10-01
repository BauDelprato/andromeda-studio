/**
 * Tipos e interfaces para el formulario de creación de alumnos.
 * Diseñado para desacoplar la interfaz de usuario y quedar preparado
 * para su posterior conexión con ASP.NET Core Web API.
 */

export type FitnessCertificateStatus = "vigente" | "vencido" | "pendiente";

export interface StudentFormValues {
  // Datos personales
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  birthDate: string;

  // Responsables
  emergencyPhone: string;
  guardian: string;

  // Salud
  fitnessStatus: FitnessCertificateStatus;
  fitnessExpirationDate: string;
  hasHealthInsurance: boolean;
  healthInsurance: string;
  notes: string;

  // Competencias
  canCompete: boolean;
  hasLiabilityWaiver: boolean;
}

/**
 * Payload representativo de la solicitud esperada por el backend ASP.NET Core
 * (e.g. POST /api/Students o CreateStudentRequest)
 */
export interface CreateStudentRequestDto {
  firstName: string;
  lastName: string;
  dni: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  emergencyPhone?: string;
  guardianName?: string;
  fitnessCertificate: boolean;
  fitnessExpirationDate?: string;
  hasHealthInsurance?: boolean;
  healthInsuranceName?: string;
  canCompete?: boolean;
  hasLiabilityWaiver?: boolean;
  notes?: string | null;
}

/**
 * Función utilitaria para transformar los valores del formulario
 * al DTO esperado por ASP.NET Core Web API.
 */
export function mapFormValuesToDto(values: StudentFormValues): CreateStudentRequestDto {
  const parts = values.fullName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  return {
    firstName,
    lastName,
    dni: values.dni.trim(),
    phone: values.phone.trim(),
    email: values.email.trim(),
    birthDate: values.birthDate || undefined,
    emergencyPhone: values.emergencyPhone.trim() || undefined,
    guardianName: values.guardian.trim() || undefined,
    fitnessCertificate: values.fitnessStatus === "vigente",
    fitnessExpirationDate: values.fitnessExpirationDate || undefined,
    hasHealthInsurance: values.hasHealthInsurance,
    healthInsuranceName: values.hasHealthInsurance ? values.healthInsurance.trim() : undefined,
    canCompete: values.canCompete,
    hasLiabilityWaiver: values.hasLiabilityWaiver,
    notes: values.notes.trim() || null,
  };
}
