import { apiFetch } from "./client";
import type { Crew, CreateCrewFormData } from "@/features/crews/types/crew";

export function getCrews() {
  return apiFetch<Crew[]>("/api/Crews");
}

export function createCrewApi(data: CreateCrewFormData) {
  return apiFetch<Crew>("/api/Crews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getCrewById(id: number) {
  return apiFetch<Crew>(`/api/Crews/${id}`);
}

export function updateCrewApi(id: number, data: CreateCrewFormData) {
  return apiFetch<Crew>(`/api/Crews/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
