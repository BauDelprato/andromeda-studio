export interface StudentFormData {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone: string;
  fitnessCertificate: boolean;
  notes: string;
}

export const emptyStudentForm: StudentFormData = {
  firstName: "",
  lastName: "",
  dni: "",
  email: "",
  phone: "",
  fitnessCertificate: false,
  notes: "",
};