import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SearchBar } from "@/components/searchbar/Searchbar";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import { paymentCurrency, formatPaymentDate } from "@/features/payments/utils/paymentFormatters";
import { CashSummaryCard } from "../components/CashSummaryCard";
import {
  CASH_PAYMENT_METHOD_LABELS,
  MOVEMENT_TYPE_FILTERS,
  MOVEMENT_TYPE_LABELS,
} from "../constants/cashRegisterOptions";
import { useCashRegister } from "../hooks/useCashRegister";
import type { CashMovementRow, MovementType } from "../types/cashRegister";
import { formatCashLongDate } from "../utils/cashRegisterFormatting";
import styles from "./CashRegister.module.css";

function CashRegister() {
  const cash = useCashRegister();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MovementType | "all">("all");

  const normalizedSearch = search.trim().toLocaleLowerCase("es-AR");
  const filteredRows = useMemo(
    () => cash.rows.filter((row) => {
      const matchesSearch = [
          row.studentName,
          row.payment.notes ?? "",
          row.payment.transactionReference ?? "",
          String(row.payment.id),
        ].some((value) => value.toLocaleLowerCase("es-AR").includes(normalizedSearch));
      const matchesType = typeFilter === "all" || typeFilter === 0;
      return matchesSearch && matchesType;
    }),
    [cash.rows, normalizedSearch, typeFilter],
  );

  const columns: TableColumn<CashMovementRow>[] = [
    { header: "Fecha", render: (row) => formatPaymentDate(row.payment.date) },
    { header: "Tipo", render: () => MOVEMENT_TYPE_LABELS[0] },
    { header: "Categoría", render: () => "No disponible" },
    { header: "Motivo", render: (row) => row.payment.notes || row.studentName || "—" },
    { header: "Método", render: (row) => CASH_PAYMENT_METHOD_LABELS[row.payment.method] },
    { header: "Monto", render: (row) => paymentCurrency.format(row.payment.amount) },
  ];

  return (
    <section className={styles.screen}>
      <header className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <h2>Caja diaria</h2>
          <p>{formatCashLongDate(new Date())}</p>
        </div>
        <span className={styles.statusBadge}>Acciones no disponibles</span>
      </header>

      <p className={styles.dataNotice} role="note">
        La gestión de caja todavía no está disponible. Se muestran los pagos reales registrados hoy;
        abrir o cerrar la caja, registrar movimientos y administrar categorías se habilitará cuando el
        backend tenga esos endpoints.
      </p>

      <div className={styles.topGrid}>
        <section className={styles.summary} aria-label="Resumen de caja">
        <CashSummaryCard
          label="Ingresos totales:"
          amount={cash.error ? null : cash.income}
          isLoading={cash.isLoading}
        />
          <CashSummaryCard label="Egresos totales:" amount={null} isLoading={cash.isLoading} />
          <CashSummaryCard label="Resumen de caja:" amount={null} isLoading={cash.isLoading} />
        </section>
        <div className={styles.actions}>
          <button className={styles.actionButton} type="button" disabled title="Todavía no disponible">
            Abrir caja
          </button>
          <button className={styles.actionButton} type="button" disabled title="Todavía no disponible">
            + Registrar movimiento
          </button>
          <button className={styles.actionButton} type="button" disabled title="Todavía no disponible">
            + Añadir nueva categoría
          </button>
          <Link
            className={`${styles.actionButton} ${styles.disabledLink}`}
            to="/cash-register/history"
            aria-disabled="true"
            onClick={(event) => event.preventDefault()}
            title="Todavía no disponible"
          >
            Ver historial
          </Link>
        </div>
      </div>

      <section className={styles.recentSection}>
        <h3>Últimos movimientos</h3>
        <div className={styles.filters}>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar categoría o motivo" />
          <label className={styles.typeFilter}>
            <span className={styles.visuallyHidden}>Filtrar por tipo</span>
            <select
              value={typeFilter === "all" ? "all" : String(typeFilter)}
              onChange={(event) =>
                setTypeFilter(event.target.value === "all" ? "all" : (Number(event.target.value) as MovementType))
              }
            >
              {MOVEMENT_TYPE_FILTERS.map((option) => (
                <option key={option.value} value={String(option.value)}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.tableScroller}>
          <Table<CashMovementRow>
            data={filteredRows}
            columns={columns}
            isLoading={cash.isLoading}
            error={cash.error}
            onRetry={cash.reload}
            getRowKey={(row) => row.id}
            emptyMessage={
              search || typeFilter !== "all"
                ? "No hay resultados para estos filtros."
                : "Todavía no hay movimientos registrados."
            }
          />
        </div>
      </section>
    </section>
  );
}

export default CashRegister;
