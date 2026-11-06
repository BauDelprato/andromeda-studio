import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/searchbar/Searchbar";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import { paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import { CashPeriodFilter } from "../components/CashPeriodFilter";
import {
  CASH_PAYMENT_METHOD_LABELS,
  MOVEMENT_TYPE_FILTERS,
  MOVEMENT_TYPE_LABELS,
} from "../constants/cashRegisterOptions";
import { useCashRegisterDailyHistory } from "../hooks/useCashRegisterDailyHistory";
import type { CashMovement, MovementType } from "../types/cashRegister";
import styles from "./CashHistory.module.css";

function CashRegisterDailyHistory() {
  const history = useCashRegisterDailyHistory();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MovementType | "all">("all");

  const normalizedSearch = search.trim().toLocaleLowerCase("es-AR");
  const filteredMovements = useMemo(
    () =>
      history.movements.filter((movement) => {
        const matchesSearch =
          !normalizedSearch ||
          [
            movement.categoryName,
            movement.notes ?? "",
            movement.paymentId === null ? "" : "pago #" + movement.paymentId,
          ].some((value) => value.toLocaleLowerCase("es-AR").includes(normalizedSearch));
        const matchesType = typeFilter === "all" || movement.type === typeFilter;
        return matchesSearch && matchesType;
      }),
    [history.movements, normalizedSearch, typeFilter],
  );

  const columns: TableColumn<CashMovement>[] = [
    { header: "Tipo", render: (movement) => MOVEMENT_TYPE_LABELS[movement.type] },
    { header: "Categoría", render: (movement) => movement.categoryName },
    {
      header: "Motivo",
      render: (movement) =>
        movement.notes ?? (movement.paymentId === null ? "—" : "Pago #" + movement.paymentId),
    },
    { header: "Método", render: (movement) => CASH_PAYMENT_METHOD_LABELS[movement.method] },
    {
      header: "Monto",
      render: (movement) => (movement.type === 1 ? "−" : "") + paymentCurrency.format(movement.amount),
    },
  ];

  const emptyMessage = !history.register
    ? "No hubo caja abierta en esta fecha."
    : search || typeFilter !== "all"
      ? "No hay resultados para estos filtros."
      : "Esta caja no tiene movimientos.";

  return (
    <section className={styles.screen}>
      <div className={styles.content}>
        <nav className={styles.links} aria-label="Navegación del historial">
          <Link className={styles.backLink} to="/cash-register">← Volver a caja</Link>
          <Link className={styles.backLink} to="/cash-register/history/monthly">Ver historial mensual</Link>
        </nav>

        <header className={styles.header}>
          <h2>Historial de caja del día</h2>
        </header>

        <CashPeriodFilter
          day={history.day}
          daysInMonth={history.daysInMonth}
          month={history.month}
          year={history.year}
          years={history.years}
          onDayChange={history.setDay}
          onMonthChange={history.setMonth}
          onYearChange={history.setYear}
        />

        <div className={styles.filters}>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar categoría o motivo" />
          <label className={styles.statusFilter}>
            <span className={styles.visuallyHidden}>Filtrar por tipo</span>
            <select
              value={typeFilter === "all" ? "all" : String(typeFilter)}
              onChange={(event) =>
                setTypeFilter(event.target.value === "all" ? "all" : (Number(event.target.value) as MovementType))
              }
            >
              <option value="all">Filtros</option>
              {MOVEMENT_TYPE_FILTERS.filter((option) => option.value !== "all").map((option) => (
                <option key={option.value} value={String(option.value)}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.tableScroller}>
          <Table<CashMovement>
            data={filteredMovements}
            columns={columns}
            isLoading={history.isLoading}
            error={history.error}
            onRetry={history.reload}
            getRowKey={(movement) => movement.id}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>
    </section>
  );
}

export default CashRegisterDailyHistory;
