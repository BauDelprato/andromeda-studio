import { ApiError } from "@/api/client";
import type { LoginResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export async function loginWithGoogle(idToken: string): Promise<LoginResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch {
    throw new ApiError(0, "No pudimos conectarnos con el servidor.");
  }

  if (!response.ok) {
    let message = "No se pudo iniciar sesión con Google.";
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // La respuesta no era JSON, se mantiene el mensaje genérico.
    }
    throw new ApiError(response.status, message);
  }

  return (await response.json()) as LoginResponse;
}
