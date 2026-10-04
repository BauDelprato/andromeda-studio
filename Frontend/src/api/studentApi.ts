import { apiFetch } from "./client";
import type { Student } from "../types/student/student";
import type { EditStudentFormData, StudentFormData } from "../types/student/studentFormTypes";

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

export function updateStudentApi(id: number, data: EditStudentFormData) {
  return apiFetch(`/api/Students/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data), 
  });
}

export function changeStudentStatusApi(id: number, activate: boolean) {
  const endpoint = activate ? "activate" : "deactivate";
  return apiFetch(`/api/Students/${id}/${endpoint}`, {
    method: "PATCH"
  });
}