import { useCallback, useEffect, useMemo, useState } from "react";
import { getCashRegisters } from "@/api/cashRegisterApi";
import { getTransactions } from "@/api/transactionApi";
import type { CashMovement, CashRegister } from "../types/cashRegister";
import {
  buildDateKey,
  getAvailableYears,
  getDaysInMonth,
  getRegisterDateKey,
} from "../utils/cashRegisterHistory";

const currentDate = new Date();

export function useCashRegisterDailyHistory() {
  const [day, setDay] = useState(currentDate.getDate());
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [isLoadingRegisters, setIsLoadingRegisters] = useState(true);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);
  const [registersError, setRegistersError] = useState<string | null>(null);
  const [movementsError, setMovementsError] = useState<string | null>(null);
  const [movementsRetry, setMovementsRetry] = useState(0);

  const reloadRegisters = useCallback(async () => {
    setIsLoadingRegisters(true);
    setRegistersError(null);
    try {
      setRegisters(await getCashRegisters());
    } catch {
      setRegisters([]);
      setRegistersError("No se pudo cargar el historial de cajas.");
    } finally {
      setIsLoadingRegisters(false);
    }
  }, []);

  useEffect(() => {
    void reloadRegisters();
  }, [reloadRegisters]);

  const daysInMonth = getDaysInMonth(year, month);
  const safeDay = Math.min(day, daysInMonth);
  const years = useMemo(() => getAvailableYears(registers), [registers]);

  const register = useMemo(() => {
    const key = buildDateKey(year, month, safeDay);
    return registers.find((item) => getRegisterDateKey(item) === key) ?? null;
  }, [registers, year, month, safeDay]);

  const registerId = register?.id ?? null;

  useEffect(() => {
    if (registerId === null) {
      setMovements([]);
      setIsLoadingMovements(false);
      setMovementsError(null);
      return;
    }

    let active = true;
    setIsLoadingMovements(true);
    setMovementsError(null);
    getTransactions({ cashRegisterId: registerId })
      .then((loaded) => {
        if (active) setMovements(loaded);
      })
      .catch(() => {
        if (!active) return;
        setMovements([]);
        setMovementsError("No se pudieron cargar los movimientos del día.");
      })
      .finally(() => {
        if (active) setIsLoadingMovements(false);
      });

    return () => {
      active = false;
    };
  }, [registerId, movementsRetry]);

  return {
    day: safeDay,
    month,
    year,
    years,
    daysInMonth,
    setDay,
    setMonth,
    setYear,
    register,
    movements,
    isLoading: isLoadingRegisters || isLoadingMovements,
    error: registersError ?? movementsError,
    reload: () => (registersError ? void reloadRegisters() : setMovementsRetry((count) => count + 1)),
  };
}
