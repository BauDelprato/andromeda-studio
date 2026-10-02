export interface StudentFormData {
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  birthDate: string;
  emergencyPhone: string;
  guardian: string;
  physicalExamExpiration: string;
  hasHealthInsurance: boolean | null;
  healthInsurance: string;
  healthNotes: string;
  canCompete: boolean | null;
  acceptsResponsibilities: boolean | null;
}
