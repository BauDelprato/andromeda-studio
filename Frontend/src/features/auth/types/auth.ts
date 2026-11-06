export interface AuthUser {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthSession extends AuthUser {
  token: string;
}

/** Respuesta de POST /api/auth/google */
export interface LoginResponse extends AuthUser {
  token: string;
}
