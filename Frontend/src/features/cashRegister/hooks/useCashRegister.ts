import { useCallback, useEffect, useMemo, useState } from "react";
import { createCashRegister, getCashRegisters, closeCashRegister } from "@/api/cashRegisterApi";
import { createCategory, getCategories } from "@/api/categoryApi";
import { createTransaction, getTransactions } from "@/api/transactionApi";
import type {
  CashCategory,
  CashMovement,
  CashRegister,
  CashSession,
  CashSummary,
  CreateCashCategoryRequest,
  CreateCashMovementRequest,
} from "../types/cashRegister";

function getUtcDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toSession(register: CashRegister | null): CashSession {
  return {
    id: register?.id ?? null,
    date: register?.date ?? null,
    isOpen: register !== null && register.closedAt === null,
    openedAt: register?.openedAt ?? null,
    openingAmount: register?.openingBalance ?? 0,
    closingAmount: register?.closingBalance ?? null,
  };
}

export function useCashRegister() {
  const [session, setSession] = useState<CashSession>(toSession(null));
  const [movements, setMovements] = useState<CashMovement[]>([]);
  const [categories, setCategories] = useState<CashCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const today = useMemo(() => getUtcDateKey(new Date()), []);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [registers, loadedCategories] = await Promise.all([getCashRegisters(), getCategories()]);
      const register =
        registers.find((item) => item.closedAt === null) ??
        registers.find((item) => item.date === today) ??
        null;
      const loadedMovements = register
        ? await getTransactions({ cashRegisterId: register.id })
        : [];
      setSession(toSession(register));
      setMovements(loadedMovements);
      setCategories(loadedCategories.filter((category) => category.isActive));
    } catch {
      setSession(toSession(null));
      setMovements([]);
      setCategories([]);
      setError("No se pudo cargar la caja diaria. Verificá la conexión con el backend.");
    } finally {
      setIsLoading(false);
    }
  }, [today]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const summary = useMemo<CashSummary>(() => {
    const income = movements
      .filter((movement) => movement.type === 0)
      .reduce((sum, movement) => sum + movement.amount, 0);
    const expenses = movements
      .filter((movement) => movement.type === 1)
      .reduce((sum, movement) => sum + movement.amount, 0);
    return {
      income,
      expenses,
      balance: session.closingAmount ?? session.openingAmount + income - expenses,
    };
  }, [movements, session.closingAmount, session.openingAmount]);

  async function performMutation(action: () => Promise<unknown>) {
    setError(null);
    try {
      await action();
      await reload();
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Ocurrió un error inesperado.");
      throw mutationError;
    }
  }

  function openSession() {
    return performMutation(() => createCashRegister());
  }

  function closeSession() {
    const id = session.id;
    if (id === null || !session.isOpen) {
      throw new Error("No hay una caja abierta para cerrar.");
    }
    return performMutation(() => closeCashRegister(id));
  }

  function addMovement(request: CreateCashMovementRequest) {
    if (!session.isOpen) {
      throw new Error("Abrí la caja antes de registrar movimientos.");
    }
    return performMutation(() => createTransaction(request));
  }

  function addCategory(request: CreateCashCategoryRequest) {
    return performMutation(() => createCategory(request));
  }

  return {
    session,
    movements,
    categories,
    summary,
    isLoading,
    error,
    reload,
    canOpen: !session.isOpen,
    openSession,
    closeSession,
    addMovement,
    addCategory,
  };
}
