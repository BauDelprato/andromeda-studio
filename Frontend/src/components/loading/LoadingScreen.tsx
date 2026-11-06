import logo from "@/components/layout/header/logo.png";
import styles from "./LoadingScreen.module.css";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className={styles.screen} role="status" aria-live="polite">
      <img src={logo} alt="Andromeda Studio" className={styles.logo} />
      <p className={styles.brand}>Andromeda Studio</p>
      <span className={styles.spinner} aria-hidden="true" />
      {message ? <p className={styles.message}>{message}</p> : null}
    </div>
  );
}
