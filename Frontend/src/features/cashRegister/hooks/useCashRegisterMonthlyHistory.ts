import { useCallback, useEffect, useMemo, useState } from "react";
import { getCashRegisters } from "@/api/cashRegisterApi";
import { getTransactions } from "@/api/transactionApi";
import type { CashRegister } from "../types/cashRegister";
import type { CashRegisterMonthRow } from "../types/cashRegisterHistory";
import { getAvailableYears, getRegisterDateKey, getRegisterDateParts } from "../utils/cashRegisterHistory";

const currentDate = new Date();

export function useCashRegisterMonthlyHistory() {
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [rows, setRows] = useState<CashRegisterMonthRow[]>([]);
  const [isLoadingRegisters, setIsLoadingRegisters] = useState(true);
  const [isLoadingRows, setIsLoadingRows] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const reloadRegisters = useCallback(async () => {
    setIsLoadingRegisters(true);
    setError(null);
    try {
      setRegisters(await getCashRegisters());
    } catch {
      setRegisters([]);
      setError("No se pudo cargar el historial de cajas.");
    } finally {
      setIsLoadingRegisters(false);
    }
  }, []);

  useEffect(() => {
    void reloadRegisters();
  }, [reloadRegisters]);

  const years = useMemo(() => getAvailableYears(registers), [registers]);

  const monthRegisters = useMemo(
    () =>
      registers
        .filter((register) => {
          const parts = getRegisterDateParts(register);
          return parts.month === month && parts.year === year;
        })
        .sort((first, second) => getRegisterDateKey(second).localeCompare(getRegisterDateKey(first))),
    [registers, month, year],
  );

  useEffect(() => {
    let active = true;
    if (monthRegisters.length === 0) {
      setRows([]);
      return;
    }

    setIsLoadingRows(true);
    // TODO: si el backend suma un endpoint con totales por caja, reemplazar este N+1.
    Promise.all(
      monthRegisters.map(async (register) => {
        const movements = await getTransactions({ cashRegisterId: register.id });
        const income = movements.filter((m) => m.type === 0).reduce((sum, m) => sum + m.amount, 0);
        const expenses = movements.filter((m) => m.type === 1).reduce((sum, m) => sum + m.amount, 0);
        return {
          id: register.id,
          register,
          income,
          expenses,
          finalBalance: register.closingBalance ?? register.openingBalance + income - expenses,
        };
      }),
    )
      .then((loaded) => {
        if (!active) return;
        setRows(loaded);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setRows([]);
        setError("No se pudieron calcular los totales de cada caja.");
      })
      .finally(() => {
        if (active) setIsLoadingRows(false);
      });

    return () => {
      active = false;
    };
  }, [monthRegisters, retry]);

  return {
    month,
    year,
    years,
    setMonth,
    setYear,
    rows,
    isLoading: isLoadingRegisters || isLoadingRows,
    error,
    reload: () => (registers.length === 0 ? void reloadRegisters() : setRetry((count) => count + 1)),
  };
}
