const SCRIPT_ID = "google-identity-services";
const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let loadPromise: Promise<void> | null = null;

/**
 * Carga el script de Google Identity Services una sola vez.
 * https://developers.google.com/identity/sign-in/web/build-button
 */
export function loadGoogleIdentity(): Promise<void> {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise<void>((resolve, reject) => {
    const fail = () => {
      loadPromise = null;
      document.getElementById(SCRIPT_ID)?.remove();
      reject(new Error("No se pudo cargar Google Identity Services."));
    };

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", fail, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", fail, { once: true });
    document.head.appendChild(script);
  });

  return loadPromise;
}
