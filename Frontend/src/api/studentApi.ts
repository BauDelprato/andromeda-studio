import { apiFetch } from "./client";
import type { Student } from "../types/student/student";

export function getStudents() {
  return apiFetch<Student[]>("/api/Students");
}

export function getStudentById(id: number) {
  return apiFetch<Student>(`/api/Students/${id}`);
}