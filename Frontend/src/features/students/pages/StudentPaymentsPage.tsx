import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useStudentDetail } from "@/features/students/hooks/useStudentDetail";
import { useStudentPaymentHistory } from "@/features/payments/hooks/useStudentPaymentHistory";
import { PaymentReceiptDialog } from "@/features/payments/components/PaymentReceiptDialog";
import type { Charge } from "@/features/payments/types/charge";
import { getChargeBillingDate, getPeriodParts } from "@/features/payments/utils/paymentFormatting"; 
import { PaymentHistoryHeader } from "../components/payments/PaymentHistoryHeader";
import { PaymentHistoryFilters } from "../components/payments/PaymentHistoryFilters";
import { PaymentHistoryTable } from "../components/payments/PaymentHistoryTable";

import styles from "./StudentPaymentsPage.module.css";

export function StudentPaymentsPage() {
  const { id } = useParams<{ id: string }>();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharge, setSelectedCharge] = useState<Charge | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  const { student, isLoading: loadingStudent } = useStudentDetail(id);
  const { charges, isLoading: loadingCharges, error } = useStudentPaymentHistory(id);

  const overdueCount = charges.filter(c => c.status === 3).length; 

  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>([new Date().getFullYear()]);
    charges.forEach((c) => {
      const parts = getPeriodParts(getChargeBillingDate(c));
      if (parts) yearsSet.add(Number(parts.year));
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [charges]);

  const filteredCharges = charges.filter(c => {
    let matchesSearch = true;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const crewName = (c.crewName || "").toLowerCase();
      const amountStr = c.amount.toString();
      matchesSearch = crewName.includes(term) || amountStr.includes(term);
    }

    const parts = getPeriodParts(getChargeBillingDate(c));
    let matchesMonth = true;
    let matchesYear = true;

    if (parts) {
       matchesMonth = selectedMonth === "all" || parts.month === selectedMonth;
       matchesYear = selectedYear === "all" || parts.year === selectedYear;
    } else {
       if (selectedMonth !== "all" || selectedYear !== "all") {
          return false; 
       }
    }

    return matchesSearch && matchesMonth && matchesYear;
  });  

  return (
    <div className={styles.container}>
      <PaymentHistoryHeader 
        student={student} 
        isLoading={loadingStudent} 
        overdueCount={overdueCount} 
      />

      <PaymentHistoryFilters
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        years={availableYears}
      />

      <PaymentHistoryTable 
        charges={filteredCharges} 
        isLoading={loadingCharges} 
        error={error}
        onViewReceipt={setSelectedCharge} 
      />

      <PaymentReceiptDialog 
        isOpen={!!selectedCharge}
        onClose={() => setSelectedCharge(null)}
        charge={selectedCharge}
        studentName={student ? `${student.firstName} ${student.lastName}` : ""}
      />
    </div>
  );
}