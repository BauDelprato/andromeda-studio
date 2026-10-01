import { NavLink } from "react-router-dom";
import {
  LuHouse,
  LuUser,
  LuNotebookPen,
  LuLayers,
  LuCreditCard,
  LuWallet,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import styles from "./Sidebar.module.css";

interface NavItem {
  label: string;
  path: string;
  icon: IconType;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", path: "/", icon: LuHouse, exact: true },
  { label: "Alumnos", path: "/students", icon: LuUser },
  { label: "Inscripciones", path: "/enrollments", icon: LuNotebookPen },
  { label: "Clases", path: "/crews", icon: LuLayers },
  { label: "Pagos", path: "/payments", icon: LuCreditCard },
  { label: "Caja", path: "/cash", icon: LuWallet },
  { label: "Sistema", path: "/system", icon: LuSettings },
];

function Sidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Navegación principal">
      {/* Logo Header */}
      <div className={styles.logoSection}>
        <img
          src="/logo.png"
          alt="Andromeda Dance School Logo"
          className={styles.logoImg}
        />
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>ANDROMEDA</span>
          <span className={styles.brandSubtitle}>DANCE SCHOOL</span>
        </div>
      </div>

      {/* Navegación central */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {NAV_ITEMS.map(({ label, path, icon: Icon, exact }) => (
            <li key={label} className={styles.navItem}>
              <NavLink
                to={path}
                end={exact}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
              >
                <span className={styles.iconWrapper}>
                  <Icon size={19} />
                </span>
                <span className={styles.linkLabel}>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer: User profile & Cerrar sesión */}
      <div className={styles.footer}>
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>JF</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Jere Farias</span>
            <span className={styles.userRole}>Administrador</span>
          </div>
        </div>

        <button
          type="button"
          className={styles.logoutBtn}
          onClick={() => console.log("Cerrar sesión")}
        >
          <LuLogOut size={18} className={styles.logoutIcon} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;