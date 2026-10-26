import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  //LuBell, //descomentar cuando se agregue el boton de notificaciones
  LuCalendar,
  LuCreditCard,
  LuLayers,
  //LuNotebookPen, //descomentar cuando se agregue la sección de inscripciones
  LuUsers,
} from "react-icons/lu";
import type { IconType } from "react-icons";
import logo from "@/components/layout/header/logo.png";
import { Button } from "@/components/Button/Button";
import { SearchBar } from "@/components/searchbar/Searchbar";
import { StatCard } from "@/components/statcard/Statcard";
import { useStudents } from "@/features/students/hooks/useStudents";
import { usePayments } from "@/features/payments/hooks/usePayments";
import styles from "./Dashboard.module.css";

interface QuickAccessCard {
  title: string;
  description: string;
  path: string;
  icon: IconType;
}

interface QuickActionButton {
  label: string;
  path?: string;
}

const SECTION_CARDS: QuickAccessCard[] = [
  {
    title: "Gestión de Alumnos",
    description: "Consulta la lista de alumnos, aptos físicos y estados.",
    path: "/students",
    icon: LuUsers,
  },
  {
    title: "Clases y Crews",
    description: "Explora las categorías y gestiona cupos y tarifas.",
    path: "/crews",
    icon: LuLayers,
  },
  /*{
    title: "Inscripciones",
    description: "Registra nuevas inscripciones y revisa el historial.",
    path: "/registrations",
    icon: LuNotebookPen,
  },*/
  {
    title: "Control de Pagos",
    description:
      "Registra pagos de mensualidades.",
    path: "/payments",
    icon: LuCreditCard,
  },
  /*{
    title: "Cierre de Caja", //cuando esté creado el formulario de caja
    description:
      "Registra ingresos y egresos de la caja.",
    path: "/payments",
    icon: LuCreditCard,
  },*/ 
];

const QUICK_ACTIONS: QuickActionButton[] = [
  { label: "+ Añadir Alumno", path: "/students/add" },
  { label: "+ Registrar pago", path: "/payments" },
  { label: "+ Nueva inscripción", path: "/crews" },
  { label: "+ Nueva movimiento de caja" }, //cuando esté credao el formulario de caja
];

const fullDateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatCurrentDate(date: Date): string {
  const formatted = fullDateFormatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(() => new Date());
  const { students, isLoading: isLoadingStudents } = useStudents();
  const { payments, isLoading: isLoadingPayments } = usePayments();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const filteredCards = SECTION_CARDS.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className={styles.dashboard}>
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.pageTitle}>Inicio</h1>
          <time
            className={styles.currentDate}
            dateTime={now.toISOString().slice(0, 10)}
          >
            <LuCalendar size={15} />
            <span>{formatCurrentDate(now)}</span>
          </time>
        </div>

        <div className={styles.topBarActions}>
          <div className={styles.searchWrapper}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Buscar..."
            />
          </div>

          {/*para mas adelante: BOTON DE NOTIFICACIONES */}
          {/* <button
            type="button"
            className={styles.notificationBtn}
            aria-label="Notificaciones"
          >
            <LuBell size={18} />
            <span className={styles.notificationDot} />
          </button> */}
        </div>
      </header>

      <section className={styles.welcomeCard}>
        <div className={styles.welcomeContent}>
          <h2 className={styles.title}>Bienvenido a Andrómeda Studio</h2>
          <p className={styles.subtitle}>
            Panel de control general de la academia de danza. Accede a las
            secciones principales para gestionar alumnos, clases y pagos.
          </p>
        </div>

        <img
          src={logo}
          alt="Andromeda Studio Logo"
          className={styles.bannerLogo}
        />
      </section>

      <section className={styles.statsRow} aria-label="Estadísticas generales">
        <StatCard
          label="Alumnos totales"
          value={students.length}
          isLoading={isLoadingStudents}
        />
        <StatCard
          label="Pagos registrados"
          value={payments.length}
          isLoading={isLoadingPayments}
        />
      </section>

      <section className={styles.quickAccessSection} aria-label="Accesos rápidos">
        <h2 className={styles.sectionHeading}>Accesos Rápidos</h2>
        <div className={styles.quickActionsGrid}>
          {QUICK_ACTIONS.map(({ label, path }) => (
            <Button
              key={label}
              type="button"
              className={styles.quickActionBtn}
              onClick={path ? () => navigate(path) : undefined}
            >
              {label}
            </Button>
          ))}
        </div>
      </section>

      <section className={styles.cardsGrid} aria-label="Accesos principales">
        {filteredCards.map(({ title, description, path, icon: Icon }) => (
          <Link key={path} to={path} className={styles.navCard}>
            <span className={styles.cardIcon}>
              <Icon size={20} />
            </span>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardDescription}>{description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;
