import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/searchbar/Searchbar";
import { StatCard } from "@/components/statcard/Statcard";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import { CHARGE_STATUS_FILTERS } from "../constants/paymentOptions";
import { OverdueCrewDialog } from "../components/OverdueCrewDialog";
import { PaymentPeriodFilter } from "../components/PaymentPeriodFilter";
import { PaymentStatusBadge } from "../components/PaymentStatusBadge";
import { usePaymentDashboard } from "../hooks/usePaymentDashboard";
import type { ChargeStatus } from "../types/charge";
import type { PaymentDashboardRow } from "../types/paymentViews";
import { formatBillingPeriod, getChargeBillingDate, getPeriodParts } from "../utils/paymentFormatting";
import styles from "./Payments.module.css";

const currentDate = new Date();

function Payments() {
  const { charges, students, crews, studentCrews, isLoading, error, reload } = usePaymentDashboard();
  const [month, setMonth] = useState(String(currentDate.getMonth()));
  const [year, setYear] = useState(String(currentDate.getFullYear()));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ChargeStatus | "all">("all");
  const [isOverdueOpen, setIsOverdueOpen] = useState(false);

  const rows = useMemo<PaymentDashboardRow[]>(() => {
    const studentsById = new Map<number, (typeof students)[number]>(
      students.map((student) => [student.id, student]),
    );
    const crewsById = new Map<number, (typeof crews)[number]>(
      crews.map((crew) => [crew.id, crew]),
    );
    const studentCrewsById = new Map<number, (typeof studentCrews)[number]>(
      studentCrews.map((studentCrew) => [studentCrew.id, studentCrew]),
    );

    return charges.map((charge) => {
      const student = studentsById.get(charge.studentId);
      const studentCrew = charge.studentCrewId ? studentCrewsById.get(charge.studentCrewId) : undefined;
      const crew = studentCrew ? crewsById.get(studentCrew.crewId) : undefined;

      return {
        id: charge.id,
        charge,
        studentId: charge.studentId,
        studentName: student
          ? student.firstName + " " + student.lastName
          : "Alumno #" + charge.studentId,
        crewId: crew?.id ?? null,
        crewName: crew?.name ?? "",
      };
    }).sort((first, second) =>
      getChargeBillingDate(second.charge).localeCompare(getChargeBillingDate(first.charge)),
    );
  }, [charges, students, crews, studentCrews]);

  const years = useMemo(() => {
    const available = new Set<number>([currentDate.getFullYear()]);
    charges.forEach((charge) => {
      const parts = getPeriodParts(getChargeBillingDate(charge));
      if (parts) available.add(Number(parts.year));
    });
    return Array.from(available).sort((first, second) => second - first);
  }, [charges]);

  const periodRows = rows.filter((row) => {
    const parts = getPeriodParts(getChargeBillingDate(row.charge));
    if (!parts) return month === "all" && year === "all";
    return (month === "all" || parts.month === month) && (year === "all" || parts.year === year);
  });

  const overdueRows = periodRows.filter((row) => row.charge.status === 3);
  const paidCount = new Set(periodRows.filter((row) => row.charge.status === 1).map((row) => row.studentId)).size;
  const pendingCount = new Set(
    periodRows.filter((row) => row.charge.status === 0 || row.charge.status === 2).map((row) => row.studentId),
  ).size;
  const overdueCount = new Set(overdueRows.map((row) => row.studentId)).size;
  const normalizedSearch = search.trim().toLocaleLowerCase("es-AR");
  const filteredRows = periodRows.filter((row) => {
    const matchesSearch =
      !normalizedSearch ||
      row.studentName.toLocaleLowerCase("es-AR").includes(normalizedSearch) ||
      formatBillingPeriod(getChargeBillingDate(row.charge)).toLocaleLowerCase("es-AR").includes(normalizedSearch) ||
      row.crewName.toLocaleLowerCase("es-AR").includes(normalizedSearch);
    const matchesStatus = statusFilter === "all" || row.charge.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns: TableColumn<PaymentDashboardRow>[] = [
    { header: "Nombre", render: (row) => row.studentName },
    { header: "Fecha", render: (row) => formatBillingPeriod(getChargeBillingDate(row.charge)) },
    { header: "Crew", render: (row) => row.crewName || "—" },
    { header: "Estado", render: (row) => <PaymentStatusBadge status={row.charge.status} /> },
  ];

  return (
    <section className={styles.screen}>
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <div>
            <h2>Pagos</h2>
            <p>Seguimiento de cargos y pagos de los alumnos.</p>
          </div>
          <Link className={styles.registerButton} to="/payments/register">Registrar pago</Link>
        </header>

        <PaymentPeriodFilter
          month={month}
          year={year}
          years={years}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />

        <section className={styles.summary} aria-label="Resumen de pagos">
          <StatCard label="Pagaron" value={paidCount} isLoading={isLoading} />
          <StatCard label="Pendientes" value={pendingCount} isLoading={isLoading} />
          <StatCard label="Atrasados" value={overdueCount} isLoading={isLoading} />
        </section>

        <div className={styles.overdueNotice}>
          <span>
            {overdueCount === 1
              ? "1 estudiante atrasado"
              : overdueCount + " estudiantes atrasados"}
          </span>
          <button
            type="button"
            onClick={() => setIsOverdueOpen(true)}
            disabled={isLoading || overdueCount === 0}
          >
            Ver <span aria-hidden="true">→</span>
          </button>
        </div>

        <section className={styles.recentSection}>
          <div className={styles.sectionHeading}>
            <h3>Recientes</h3>
          </div>
          <div className={styles.filters}>
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar alumno/fecha/crew" />
            <label className={styles.statusFilter}>
              <span className={styles.visuallyHidden}>Filtrar por estado</span>
              <select
                value={statusFilter === "all" ? "all" : String(statusFilter)}
                onChange={(event) =>
                  setStatusFilter(event.target.value === "all" ? "all" : Number(event.target.value) as ChargeStatus)
                }
              >
                <option value="all">Filtros</option>
                {CHARGE_STATUS_FILTERS.filter((option) => option.value !== "all").map((option) => (
                  <option key={option.value} value={String(option.value)}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className={styles.tableScroller}>
            <Table<PaymentDashboardRow>
              data={filteredRows}
              columns={columns}
              isLoading={isLoading}
              error={error}
              onRetry={reload}
              getRowKey={(row) => row.id}
              emptyMessage={
                search || statusFilter !== "all"
                  ? "No hay resultados para estos filtros."
                  : "No hay cargos para mostrar en este período."
              }
            />
          </div>
        </section>
      </div>

      {isOverdueOpen && (
        <OverdueCrewDialog
          rows={overdueRows}
          crews={crews}
          onClose={() => setIsOverdueOpen(false)}
        />
      )}
    </section>
  );
}

export default Payments;
