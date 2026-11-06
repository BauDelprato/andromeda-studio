import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LuSettings } from "react-icons/lu";
import { SearchBar } from "@/components/searchbar/Searchbar";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import { paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import { CashCategoryDialog } from "../components/CashCategoryDialog";
import { CashMovementDialog } from "../components/CashMovementDialog";
import { CashSessionDialog } from "../components/CashSessionDialog";
import { CashSummaryCard } from "../components/CashSummaryCard";
import {
  CASH_PAYMENT_METHOD_LABELS,
  MOVEMENT_TYPE_FILTERS,
  MOVEMENT_TYPE_LABELS,
} from "../constants/cashRegisterOptions";
import { useCashRegister } from "../hooks/useCashRegister";
import type { CashMovementRow, MovementType } from "../types/cashRegister";
import { formatCashDate, formatCashLongDate } from "../utils/cashRegisterFormatting";
import styles from "./CashRegister.module.css";

type DialogState = "movement" | "category" | "open" | "close" | null;

function CashRegister() {
  const cash = useCashRegister();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MovementType | "all">("all");
  const [dialog, setDialog] = useState<DialogState>(null);

  const rows = useMemo<CashMovementRow[]>(
    () => cash.movements.map((movement) => ({ id: movement.id, movement })),
    [cash.movements],
  );
  const normalizedSearch = search.trim().toLocaleLowerCase("es-AR");
  const filteredRows = rows.filter((row) => {
    const matchesSearch = [
      row.movement.categoryName,
      row.movement.notes ?? "",
      String(row.movement.id),
      row.movement.paymentId === null ? "" : String(row.movement.paymentId),
    ].some((value) => value.toLocaleLowerCase("es-AR").includes(normalizedSearch));
    const matchesType = typeFilter === "all" || row.movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns: TableColumn<CashMovementRow>[] = [
    { header: "Fecha", render: (row) => formatCashDate(row.movement.createdAt) },
    { header: "Tipo", render: (row) => MOVEMENT_TYPE_LABELS[row.movement.type] },
    { header: "Categoría", render: (row) => row.movement.categoryName },
    {
      header: "Motivo",
      render: (row) =>
        row.movement.notes ??
        (row.movement.paymentId === null ? "—" : `Pago #${row.movement.paymentId}`),
    },
    { header: "Método", render: (row) => CASH_PAYMENT_METHOD_LABELS[row.movement.method] },
    {
      header: "Monto",
      render: (row) =>
        (row.movement.type === 1 ? "−" : "") + paymentCurrency.format(row.movement.amount),
    },
  ];

  const hasRegister = cash.session.id !== null;

  return (
    <section className={styles.screen}>
      <div className={styles.topBar}>
        <h1 className={styles.topBarTitle}>Cajas</h1>
        <button type="button" className={styles.settingsButton} aria-label="Configuración">
          <LuSettings size={18} />
        </button>
      </div>

      <header className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <h2>Caja diaria</h2>
          <p>{formatCashLongDate(new Date())}</p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.openButton}
            type="button"
            disabled={cash.isLoading || !cash.canOpen}
            title={!cash.canOpen ? "La caja de hoy ya fue cerrada o está abierta" : undefined}
            onClick={() => setDialog("open")}
          >
            Abrir Caja
          </button>
          <button
            className={styles.closeButton}
            type="button"
            disabled={cash.isLoading || !cash.session.isOpen}
            title={!cash.session.isOpen ? "No hay una caja abierta para cerrar" : undefined}
            onClick={() => setDialog("close")}
          >
            Cerrar Caja
          </button>
        </div>
      </header>

      <section className={styles.summary} aria-label="Resumen de caja">
        <CashSummaryCard
          label="Resumen de caja:"
          amount={hasRegister ? cash.summary.balance : null}
          isLoading={cash.isLoading}
        />
        <CashSummaryCard
          label="Ingresos totales:"
          amount={hasRegister ? cash.summary.income : null}
          isLoading={cash.isLoading}
        />
        <CashSummaryCard
          label="Egresos totales:"
          amount={hasRegister ? cash.summary.expenses : null}
          isLoading={cash.isLoading}
        />
      </section>

      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          type="button"
          disabled={!cash.session.isOpen || cash.categories.length === 0}
          title={
            !cash.session.isOpen
              ? "Abrí la caja para registrar movimientos"
              : cash.categories.length === 0
                ? "Creá una categoría para registrar movimientos"
                : undefined
          }
          onClick={() => setDialog("movement")}
        >
          + Registrar movimiento
        </button>
        <button
          className={styles.actionButton}
          type="button"
          disabled={cash.isLoading}
          onClick={() => setDialog("category")}
        >
          + Añadir nueva categoría
        </button>
        <Link className={styles.actionButton} to="/cash-register/history">
          Historial Mensual
        </Link>
        <Link className={styles.actionButton} to="/cash-register/history">
          Historial Diario
        </Link>
      </div>

      <section className={styles.recentSection}>
        <h3>Últimos movimientos</h3>
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Buscar categoría o motivo"
            />
          </div>
          <label className={styles.typeFilter}>
            <span className={styles.visuallyHidden}>Filtrar por tipo</span>
            <select
              value={typeFilter === "all" ? "all" : String(typeFilter)}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value === "all" ? "all" : (Number(event.target.value) as MovementType),
                )
              }
            >
              {MOVEMENT_TYPE_FILTERS.map((option) => (
                <option key={option.value} value={String(option.value)}>
                  {option.label}
                </option>
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

      {dialog === "movement" && (
        <CashMovementDialog
          categories={cash.categories}
          onClose={() => setDialog(null)}
          onSubmit={cash.addMovement}
        />
      )}
      {dialog === "category" && (
        <CashCategoryDialog onClose={() => setDialog(null)} onSubmit={cash.addCategory} />
      )}
      {(dialog === "open" || dialog === "close") && (
        <CashSessionDialog
          mode={dialog}
          balance={cash.summary.balance}
          onClose={() => setDialog(null)}
          onOpenSession={cash.openSession}
          onCloseSession={cash.closeSession}
        />
      )}
    </section>
  );
}

export default CashRegister;
