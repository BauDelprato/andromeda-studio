import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "@/api/client";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import logo from "@/components/layout/header/logo.png";
import { loginWithGoogle } from "../api/authApi";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";
import styles from "./LoginPage.module.css";

function getRedirectPath(state: unknown): string {
  const from = (state as { from?: string } | null)?.from;
  return from && from !== "/login" ? from : "/";
}

export default function LoginPage() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = getRedirectPath(location.state);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleCredential = async (credential: string) => {
    setIsSigningIn(true);
    setError(null);

    try {
      const response = await loginWithGoogle(credential);
      signIn(response);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setIsSigningIn(false);
      setError(
        err instanceof ApiError && err.status === 401
          ? "Tu cuenta de Google no está habilitada para ingresar a Andromeda Studio."
          : "No pudimos iniciar sesión. Intentá de nuevo en unos minutos."
      );
    }
  };

  if (isSigningIn) {
    return <LoadingScreen message="Verificando tu cuenta…" />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="login-title">
        <img src={logo} alt="Andromeda Studio" className={styles.logo} />

        <h1 id="login-title" className={styles.srOnly}>
          Iniciar sesión
        </h1>

        <div className={styles.google}>
          <GoogleSignInButton onCredential={handleCredential} />
        </div>

        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}

        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              disabled
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              disabled
              autoComplete="current-password"
            />
          </div>

          <button
            type="button"
            className={styles.forgot}
            disabled
            title="Disponible próximamente"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <button
            type="submit"
            className={styles.submit}
            disabled
            title="El acceso con usuario y contraseña estará disponible próximamente"
          >
            Iniciar sesión
          </button>
        </form>

        <p className={styles.note}>
          El acceso con usuario y contraseña estará disponible próximamente.
        </p>
      </section>
    </main>
  );
}
