import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUsers,
  LuCreditCard,
  LuChevronLeft,
  LuChevronRight,
  LuSettings,
  LuLogOut,
  LuNotebookPen,
  LuUser,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import styles from "./Sidebar.module.css";

interface NavItem {
  label: string;
  path: string;
  icon: IconType;
  badge?: string | number;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", path: "/", icon: LuLayoutDashboard },
  { label: "Alumnos", path: "/students", icon: LuUser },
  { label: "Grupos", path: "/crews", icon: LuUsers },
  { label: "Inscripciones", path: "/registrations", icon: LuNotebookPen },
  { label: "Pagos", path: "/payments", icon: LuCreditCard },
  
];

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
      aria-label="Navegación principal"
    >
      {/* Botón de toggle colapsar/expandir */}
      <div className={styles.toggleWrapper}>
        <button
          type="button"
          onClick={toggleCollapse}
          className={styles.toggleBtn}
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          title={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? <LuChevronRight size={18} /> : <LuChevronLeft size={18} />}
        </button>
      </div>

      {/* Navegación central */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {NAV_ITEMS.map(({ label, path, icon: Icon, badge }) => (
            <li key={path} className={styles.navItem}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
                title={isCollapsed ? label : undefined}
              >
                <span className={styles.iconWrapper}>
                  <Icon size={20} />
                </span>
                {!isCollapsed && <span className={styles.linkLabel}>{label}</span>}
                {!isCollapsed && badge && (
                  <span className={styles.badge}>{badge}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer / Opciones secundarias */}
      <div className={styles.footer}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <button
              type="button"
              className={`${styles.navLink} ${styles.logoutBtn}`}
              onClick={() => console.log("Cerrar sesión")}
              title={isCollapsed ? "Cerrar sesión" : undefined}
            >
              <span className={styles.iconWrapper}>
                <LuLogOut size={20} />
              </span>
              {!isCollapsed && <span className={styles.linkLabel}>Salir</span>}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;