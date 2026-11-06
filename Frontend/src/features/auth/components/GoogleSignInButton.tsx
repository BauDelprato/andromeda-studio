import { useEffect, useRef, useState } from "react";
import { loadGoogleIdentity } from "../lib/googleIdentity";
import styles from "./GoogleSignInButton.module.css";

type Status = "loading" | "ready" | "error" | "unconfigured";

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
}

export function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onCredentialRef = useRef(onCredential);
  onCredentialRef.current = onCredential;

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const [status, setStatus] = useState<Status>(
    clientId ? "loading" : "unconfigured"
  );

  useEffect(() => {
    if (!clientId) return;

    let active = true;

    loadGoogleIdentity()
      .then(() => {
        if (!active || !containerRef.current || !window.google) return;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              onCredentialRef.current(response.credential);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: "popup",
        });

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "filled_blue",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          locale: "es",
        });

        setStatus("ready");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [clientId]);

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.button} />
      {status === "loading" && (
        <p className={styles.hint}>Cargando acceso con Google…</p>
      )}
      {status === "error" && (
        <p className={styles.hint} role="alert">
          No se pudo cargar Google. Revisá tu conexión e intentá de nuevo.
        </p>
      )}
      {status === "unconfigured" && (
        <p className={styles.hint} role="alert">
          Falta configurar VITE_GOOGLE_CLIENT_ID en el Frontend.
        </p>
      )}
    </div>
  );
}
