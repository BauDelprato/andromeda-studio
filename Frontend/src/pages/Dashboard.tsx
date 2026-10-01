import { Link } from "react-router-dom";
import { LuUsers, LuLayers, LuCreditCard, LuNotebookPen } from "react-icons/lu";
import { StatCard } from "@/components/statcard/Statcard";
import { useStudents } from "@/hooks/useStudents";
import { usePayments } from "@/hooks/usePayments";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const { students, isLoading: loadingStudents } = useStudents();
  const { payments, isLoading: loadingPayments } = usePayments();

  return (
    <div className={styles.container}>
      {/* Welcome Banner */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeContent}>
          <h2 className={styles.welcomeTitle}>Bienvenido a Andromeda</h2>
          <p className={styles.welcomeText}>
            Panel de control general de la academia de danza. Accede a las
            secciones principales para gestionar alumnos, clases e inscripciones.
          </p>
        </div>
        <img
          src="/logo.png"
          alt="Andromeda Dance School"
          className={styles.welcomeLogo}
        />
      </div>

      {/* Metrics Row */}
      <div className={styles.statsRow}>
        <StatCard
          label="Alumnos totales"
          value={students.length}
          isLoading={loadingStudents}
          icon={<LuUsers size={22} />}
        />
        <StatCard
          label="Pagos registrados"
          value={payments.length}
          isLoading={loadingPayments}
          icon={<LuCreditCard size={22} />}
        />
      </div>

      {/* Quick Access Grid */}
      <div className={styles.shortcutsGrid}>
        <Link to="/students" className={styles.shortcutCard}>
          <div className={styles.shortcutIcon}>
            <LuUsers size={20} />
          </div>
          <h3 className={styles.shortcutTitle}>Gestión de Alumnos</h3>
          <p className={styles.shortcutDesc}>
            Consulta la lista de alumnos, aptos físicos y estados.
          </p>
        </Link>

        <Link to="/crews" className={styles.shortcutCard}>
          <div className={styles.shortcutIcon}>
            <LuLayers size={20} />
          </div>
          <h3 className={styles.shortcutTitle}>Clases y Crews</h3>
          <p className={styles.shortcutDesc}>
            Explora las categorías y gestiona cupos y tarifas.
          </p>
        </Link>

        <Link to="/enrollments" className={styles.shortcutCard}>
          <div className={styles.shortcutIcon}>
            <LuNotebookPen size={20} />
          </div>
          <h3 className={styles.shortcutTitle}>Inscripciones</h3>
          <p className={styles.shortcutDesc}>
            Registra nuevas inscripciones y revisa el historial.
          </p>
        </Link>

        <Link to="/payments" className={styles.shortcutCard}>
          <div className={styles.shortcutIcon}>
            <LuCreditCard size={20} />
          </div>
          <h3 className={styles.shortcutTitle}>Control de Pagos</h3>
          <p className={styles.shortcutDesc}>
            Registra pagos de mensualidades en efectivo o transferencia.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
