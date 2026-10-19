import { apiFetch } from "./client";
import type { Crew, CrewFormData } from "@/features/crews/types/crew";

export function getCrews() {
  return apiFetch<Crew[]>("/api/Crews");
}

export function createCrewApi(data: CrewFormData) {
  return apiFetch<Crew>("/api/Crews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCrewById(id: number) {
  return apiFetch<Crew>(`/api/Crews/${id}`);
}

export function updateCrewApi(id: number, data: CrewFormData) {
  return apiFetch<Crew>(`/api/Crews/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
