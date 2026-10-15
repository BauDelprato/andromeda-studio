import { apiFetch } from "./client";
import type { StudentCrewResponse } from "@/features/crews/types/studentCrew";

export async function getStudentCrewsByCrew(crewId: number) {
  const allStudentCrews = await apiFetch<StudentCrewResponse[]>("/api/StudentCrew");
  
  return allStudentCrews.filter(sc => sc.crewId === crewId);
}

export function addStudentToCrewApi(studentId: number, crewId: number) {
  return apiFetch("/api/StudentCrew", {
    method: "POST",
    body: JSON.stringify({ studentId, crewId }),
  });
}

export async function removeStudentFromCrewApi(studentId: number, crewId: number) {
  try {
    await apiFetch(`/api/StudentCrew/${studentId}/${crewId}`, {
      method: "DELETE",
    });
    return true;
  } catch (error: any) {
    if (error.message && error.message.includes("JSON")) {
      return true;
    }
    throw error;
  }
}