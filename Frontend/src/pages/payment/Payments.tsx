import { useState } from "react";
import { createPayment } from "@/api/paymentApi";
import { SearchBar } from "@/components/searchbar/Searchbar";
import { StatCard } from "@/components/statcard/Statcard";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import { usePayments } from "@/hooks/usePayments";
import { useStudents } from "@/hooks/useStudents";
import type { Payment, PaymentMethod } from "@/types/payment/payment";
import type { Student } from "@/types/student/student";
import styles from "./Payments.module.css";

const methodLabels: Record<PaymentMethod, string> = {
  0: "Efectivo",
  1: "Transferencia",
};

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium",
  timeZone: "UTC",
});

function getToday() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
}

function Payments() {
  const {
    payments,
    isLoading,
    error,
    reload,
  } = usePayments();
  const { students, isLoading: studentsLoading } = useStudents();
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getToday);
  const [method, setMethod] = useState<PaymentMethod>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const studentsById = new Map<number, Student>(
    students.map((student) => [student.id, student]),
  );

  const filteredPayments = payments.filter((payment) => {
    const searchValue = search.toLowerCase().trim();
    if (!searchValue) return true;

    const student = studentsById.get(payment.studentId);
    const studentName = student
      ? `${student.firstName} ${student.lastName}`.toLowerCase()
      : `alumno ${payment.studentId}`;

    return (
      studentName.includes(searchValue) ||
      methodLabels[payment.method].toLowerCase().includes(searchValue) ||
      String(payment.amount).includes(searchValue)
    );
  });

  const paymentColumns: TableColumn<Payment>[] = [
    {
      header: "Alumno",
      render: (payment) => {
        const student = studentsById.get(payment.studentId);
        return student
          ? `${student.firstName} ${student.lastName}`
          : `Alumno #${payment.studentId}`;
      },
    },
    {
      header: "Fecha",
      render: (payment) => dateFormatter.format(new Date(payment.date)),
    },
    {
      header: "Medio de pago",
      render: (payment) => methodLabels[payment.method],
    },
    {
      header: "Importe",
      render: (payment) => currencyFormatter.format(payment.amount),
    },
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!studentId || !amount || Number(amount) < 0) {
      setFormError("Seleccioná un alumno e ingresá un importe válido.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createPayment({
        studentId: Number(studentId),
        amount: Number(amount),
        date,
        method,
      });
      await reload();
      setAmount("");
      setSuccessMessage("El pago se registró correctamente.");
    } catch (error) {
      console.error("Error creating payment:", error);
      setFormError("No se pudo registrar el pago. Revisá los datos e intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.heading}>
        <div>
          <h2>Control de Pagos</h2>
          <p>Historial y registro de mensualidades y pagos de alumnos.</p>
        </div>
        <StatCard label="Pagos registrados" value={payments.length} isLoading={isLoading} />
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h3>Registrar pago</h3>
        <div className={styles.fields}>
          <label className={styles.field}>
            <span>Alumno</span>
            <select
              required
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              disabled={studentsLoading || students.length === 0}
            >
              <option value="">
                {studentsLoading ? "Cargando alumnos..." : "Seleccionar alumno"}
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span>Importe</span>
            <input
              required
              min="0"
              step="0.01"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0,00"
            />
          </label>

          <label className={styles.field}>
            <span>Fecha</span>
            <input
              required
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Medio de pago</span>
            <select
              value={method}
              onChange={(event) => setMethod(Number(event.target.value) as PaymentMethod)}
            >
              <option value={0}>Efectivo</option>
              <option value={1}>Transferencia</option>
            </select>
          </label>
        </div>

        <div className={styles.formFooter}>
          <div aria-live="polite">
            {formError && <p className={styles.error}>{formError}</p>}
            {successMessage && <p className={styles.success}>{successMessage}</p>}
          </div>
          <button className={styles.submit} type="submit" disabled={isSubmitting || students.length === 0}>
            {isSubmitting ? "Registrando..." : "Registrar pago"}
          </button>
        </div>
      </form>

      <div className={styles.listHeading}>
        <h3>Pagos recientes</h3>
        <SearchBar value={search} onChange={setSearch} placeholder="Buscar por alumno o medio" />
      </div>

      <Table<Payment>
        data={filteredPayments}
        columns={paymentColumns}
        isLoading={isLoading}
        error={error}
        onRetry={reload}
        emptyMessage={search ? "No se encontraron pagos." : "No hay pagos para mostrar."}
      />
    </section>
  );
}

export default Payments;

