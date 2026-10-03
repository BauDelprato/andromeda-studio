import { apiFetch } from "./client";
import type { Student } from "../types/student/student";
import type { StudentFormData } from "../types/student/studentFormTypes";

export function getStudents() {
  return apiFetch<Student[]>("/api/Students");
}

export function getStudentById(id: number) {
  return apiFetch<Student>(`/api/Students/${id}`);
}

export function createStudent(studentData: StudentFormData) {
  return apiFetch("/api/Students", {
    method: "POST",
    body: JSON.stringify(studentData),
  });
}