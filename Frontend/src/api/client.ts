import { getStoredToken } from "@/features/auth/lib/authStorage";

const API_URL = import.meta.env.VITE_API_URL;

/** Se dispara cuando el backend responde 401: la sesión guardada ya no sirve. */
export const UNAUTHORIZED_EVENT = "andromeda:unauthorized";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string; title?: string };
    return body.message ?? body.title ?? `API error: ${response.status}`;
  } catch {
    return `API error: ${response.status}`;
  }
}

async function request(endpoint: string, options?: RequestInit): Promise<Response> {
  const token = getStoredToken();
  const { headers, ...rest } = options ?? {};

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(response.status, await parseErrorMessage(response));
  }

  return response;
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await request(endpoint, options);
  return response.json() as Promise<T>;
}

export async function apiFetchVoid(
  endpoint: string,
  options?: RequestInit
): Promise<void> {
  await request(endpoint, options);
}
