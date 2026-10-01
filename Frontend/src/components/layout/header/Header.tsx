import { useLocation } from "react-router-dom";
import { LuSearch, LuBell } from "react-icons/lu";
import styles from "./Header.module.css";

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/students")) return "Alumnos";
  if (pathname.startsWith("/registrations") || pathname.startsWith("/enrollments")) return "Inscripciones";
  if (pathname.startsWith("/crews")) return "Clases";
  if (pathname.startsWith("/payments")) return "Pagos";
  if (pathname.startsWith("/cash")) return "Caja";
  if (pathname.startsWith("/system")) return "Sistema";
  return "Inicio";
}

function Header() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.actions}>
        <div className={styles.searchWrapper}>
          <LuSearch size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar..."
            className={styles.searchInput}
            aria-label="Buscar en el sistema"
          />
        </div>

        <button
          type="button"
          className={styles.notificationBtn}
          aria-label="Notificaciones"
          title="Notificaciones"
        >
          <LuBell size={18} />
          <span className={styles.notificationDot} />
        </button>
      </div>
    </header>
  );
}

export default Header;