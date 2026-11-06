import { useState } from "react";
import { Link } from "react-router-dom";
import { LuListFilter } from "react-icons/lu";
import { SearchBar } from "@/components/searchbar/Searchbar";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import { paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import { CashMonthlyFiltersDialog } from "../components/CashMonthlyFiltersDialog";
import { CashPeriodFilter } from "../components/CashPeriodFilter";
import { DEFAULT_MONTHLY_FILTERS, WEEKDAY_NAMES } from "../constants/cashRegisterHistoryOptions";
import { useCashRegisterMonthlyHistory } from "../hooks/useCashRegisterMonthlyHistory";
import type { CashMonthlyFilters, CashRegisterMonthRow } from "../types/cashRegisterHistory";
import { formatRegisterDate, getRegisterWeekday } from "../utils/cashRegisterHistory";
import styles from "./CashHistory.module.css";

function CashRegisterMonthlyHistory() {
  const history = useCashRegisterMonthlyHistory();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<CashMonthlyFilters>(DEFAULT_MONTHLY_FILTERS);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const activeFilters =
    (filters.weekday !== "all" ? 1 : 0) + (filters.minFinalBalance !== null ? 1 : 0);
  const normalizedSearch = search.trim().toLocaleLowerCase("es-AR");

  const filteredRows = history.rows.filter((row) => {
    const matchesSearch =
      !normalizedSearch || formatRegisterDate(row.register).toLocaleLowerCase("es-AR").includes(normalizedSearch);
    const matchesWeekday = filters.weekday === "all" || getRegisterWeekday(row.register) === filters.weekday;
    const matchesAmount = filters.minFinalBalance === null || row.finalBalance >= filters.minFinalBalance;
    return matchesSearch && matchesWeekday && matchesAmount;
  });

  const columns: TableColumn<CashRegisterMonthRow>[] = [
    { header: "Fecha", render: (row) => formatRegisterDate(row.register) },
    { header: "Ingresos", render: (row) => paymentCurrency.format(row.income) },
    { header: "Egresos", render: (row) => paymentCurrency.format(row.expenses) },
    { header: "Monto final", render: (row) => paymentCurrency.format(row.finalBalance) },
  ];

  return (
    <section className={styles.screen}>
      <div className={styles.content}>
        <nav className={styles.links} aria-label="Navegación del historial">
          <Link className={styles.backLink} to="/cash-register">← Volver a caja</Link>
          <Link className={styles.backLink} to="/cash-register/history/daily">Ver historial del día</Link>
        </nav>

        <header className={styles.header}>
          <h2>Historial de caja mensual</h2>
        </header>

        <CashPeriodFilter
          month={history.month}
          year={history.year}
          years={history.years}
          onMonthChange={history.setMonth}
          onYearChange={history.setYear}
        />

        <div className={styles.filters}>
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar día" />
          <button className={styles.filterButton} type="button" onClick={() => setIsFiltersOpen(true)}>
            <LuListFilter size={16} aria-hidden="true" />
            Filtros{activeFilters > 0 ? ` (${activeFilters})` : ""}
          </button>
        </div>

        {activeFilters > 0 && (
          <p className={styles.activeFilters}>
            {filters.weekday !== "all" && <span>Solo {WEEKDAY_NAMES[filters.weekday]}</span>}
            {filters.minFinalBalance !== null && (
              <span>Monto final desde {paymentCurrency.format(filters.minFinalBalance)}</span>
            )}
          </p>
        )}

        <div className={styles.tableScroller}>
          <Table<CashRegisterMonthRow>
            data={filteredRows}
            columns={columns}
            isLoading={history.isLoading}
            error={history.error}
            onRetry={history.reload}
            getRowKey={(row) => row.id}
            emptyMessage={
              search || activeFilters > 0
                ? "No hay resultados para estos filtros."
                : "No hubo cajas registradas en este mes."
            }
          />
        </div>
      </div>

      {isFiltersOpen && (
        <CashMonthlyFiltersDialog
          filters={filters}
          onApply={setFilters}
          onClose={() => setIsFiltersOpen(false)}
        />
      )}
    </section>
  );
}

export default CashRegisterMonthlyHistory;
