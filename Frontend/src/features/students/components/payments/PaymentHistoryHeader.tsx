import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button/Button";
import type { Student } from "@/features/students/types/student";
import styles from "./PaymentHistory.module.css";

interface HeaderProps {
  student: Student | null;
  isLoading: boolean;
  overdueCount: number;
}

export function PaymentHistoryHeader({ student, isLoading, overdueCount }: HeaderProps) {
  const navigate = useNavigate();
  const fullName = student ? `${student.firstName} ${student.lastName}` : "";

  return (
    <>
      <div className={styles.header}>
        <div>
          <h2 className={styles.subtitle}>Historial de pagos de:</h2>
          <h1 className={styles.title}>{isLoading ? "Cargando..." : fullName}</h1>
        </div>
        <Button onClick={() => navigate('/payments/register')}>
          + Registrar pago
        </Button>
      </div>

      {overdueCount > 0 && (
        <div className={styles.overdueAlert}>
          <span>{overdueCount} pagos atrasados</span>
        </div>
      )}
    </>
  );
}