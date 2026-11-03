import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Table } from "@/components/table/Table";
import type { TableColumn } from "@/components/table/types";
import { getCashRegisters } from "@/api/cashRegisterApi";
import { getTransactions } from "@/api/transactionApi";
import { paymentCurrency } from "@/features/payments/utils/paymentFormatters";
import { CASH_PAYMENT_METHOD_LABELS, MOVEMENT_TYPE_LABELS } from "../constants/cashRegisterOptions";
import type { CashMovement, CashRegister } from "../types/cashRegister";
import { formatCashDate } from "../utils/cashRegisterFormatting";
import styles from "./CashRegister.module.css";

function CashRegisterHistory() {
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [selectedRegisterId, setSelectedRegisterId] = useState<number | null>(null);
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [isLoadingRegisters, setIsLoadingRegisters] = useState(true);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [movementError, setMovementError] = useState<string | null>(null);
  const [movementRetry, setMovementRetry] = useState(0);

  const reloadRegisters = useCallback(async () => {
    setIsLoadingRegisters(true);
    setRegisterError(null);
    try {
      const loadedRegisters = await getCashRegisters();
      setRegisters(loadedRegisters);
      setSelectedRegisterId((current) =>
        current !== null && loadedRegisters.some((register) => register.id === current)
          ? current
          : loadedRegisters[0]?.id ?? null,
      );
    } catch (loadError) {
      setRegisters([]);
      setSelectedRegisterId(null);
      setRegisterError(loadError instanceof Error ? loadError.message : "No se pudo cargar el historial de cajas.");
    } finally {
      setIsLoadingRegisters(false);
    }
  }, []);

  useEffect(() => {
    void reloadRegisters();
  }, [reloadRegisters]);

  useEffect(() => {
    if (selectedRegisterId === null) {
      setMovements([]);
      setIsLoadingMovements(false);
      setMovementError(null);
      return;
    }

    let active = true;
    setIsLoadingMovements(true);
    setMovementError(null);
    getTransactions({ cashRegisterId: selectedRegisterId })
      .then((loadedMovements) => {
        if (active) setMovements(loadedMovements);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setMovements([]);
        setMovementError(loadError instanceof Error ? loadError.message : "No se pudieron cargar los movimientos.");
      })
      .finally(() => {
        if (active) setIsLoadingMovements(false);
      });

    return () => {
      active = false;
    };
  }, [selectedRegisterId, movementRetry]);

  const registerColumns: TableColumn<CashRegister>[] = [
    { header: "Fecha", render: (register) => formatCashDate(register.date) },
    { header: "Estado", render: (register) => register.closedAt ? "Cerrada" : "Abierta" },
    { header: "Saldo inicial", render: (register) => paymentCurrency.format(register.openingBalance) },
    {
      header: "Saldo final",
      render: (register) => register.closingBalance === null ? "—" : paymentCurrency.format(register.closingBalance),
    },
  ];

  const movementColumns: TableColumn<CashMovement>[] = [
    { header: "Fecha", render: (movement) => formatCashDate(movement.createdAt) },
    { header: "Tipo", render: (movement) => MOVEMENT_TYPE_LABELS[movement.type] },
    { header: "Categoría", render: (movement) => movement.categoryName },
    {
      header: "Motivo",
      render: (movement) => movement.notes ?? (movement.paymentId === null ? "—" : `Pago #${movement.paymentId}`),
    },
    { header: "Método", render: (movement) => CASH_PAYMENT_METHOD_LABELS[movement.method] },
    {
      header: "Monto",
      render: (movement) =>
        (movement.type === 1 ? "−" : "") + paymentCurrency.format(movement.amount),
    },
  ];

  const selectedRegister = useMemo(
    () => registers.find((register) => register.id === selectedRegisterId) ?? null,
    [registers, selectedRegisterId],
  );

  return (
    <section className={styles.screen}>
      <header className={styles.pageHeader}>
        <div className={styles.titleGroup}>
          <h2>Historial de caja</h2>
        </div>
        <Link className={styles.actionButton} to="/cash-register">Volver a caja</Link>
      </header>

      <section className={styles.recentSection}>
        <h3>Cajas registradas</h3>
        <div className={styles.tableScroller}>
          <Table<CashRegister>
            data={registers}
            columns={registerColumns}
            isLoading={isLoadingRegisters}
            error={registerError}
            onRetry={reloadRegisters}
            getRowKey={(register) => register.id}
            onRowClick={(register) => setSelectedRegisterId(register.id)}
            emptyMessage="Todavía no hay cajas registradas."
          />
        </div>
      </section>

      {selectedRegister && (
        <section className={styles.recentSection}>
          <h3>Movimientos del {formatCashDate(selectedRegister.date)}</h3>
          <div className={styles.tableScroller}>
            <Table<CashMovement>
              data={movements}
              columns={movementColumns}
              isLoading={isLoadingMovements}
              error={movementError}
              onRetry={() => setMovementRetry((count) => count + 1)}
              getRowKey={(movement) => movement.id}
              emptyMessage="Esta caja no tiene movimientos."
            />
          </div>
        </section>
      )}
    </section>
  );
}

export default CashRegisterHistory;
