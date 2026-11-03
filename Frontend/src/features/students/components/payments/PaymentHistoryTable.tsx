import { Table } from "@/components/table/Table";
import { Button } from "@/components/Button/Button";
import { paymentCurrency, formatPaymentDate, formatBillingPeriod } from "@/features/payments/utils/paymentFormatters";
import type { Charge } from "@/features/payments/types/charge"; // Ajusta la ruta a tu tipo
import styles from "./PaymentHistory.module.css";

interface TableProps {
  charges: Charge[];
  isLoading: boolean;
  error: string | null;
  onViewReceipt: (charge: Charge) => void;
}

export function PaymentHistoryTable({ charges, isLoading, error, onViewReceipt }: TableProps) {
  const columns = [
    { 
      header: "Fecha", 
      className: styles.colDate,
      render: (c: Charge) => formatPaymentDate(c.createdAt) 
    },
    { 
      header: "Pago", 
      className: styles.colAmount,
      render: (c: Charge) => paymentCurrency.format(c.amount) 
    },
    { 
      header: "Crew", 
      className: styles.colCrew,
      render: (c: Charge) => c.crewName || "N/A" 
    },
    { 
      header: "MES", 
      className: styles.colMonth,
      render: (c: Charge) => formatBillingPeriod(c.billingPeriod) 
    },
    { 
      header: "Descuento", 
      className: styles.colDiscount,
      render: (c: Charge) => c.discountAmount > 0 ? paymentCurrency.format(c.discountAmount) : "-"
    },
    {
      header: "",
      className: styles.colAction,
      render: (c: Charge) => {
        const isPaid = c.status === 1 || c.status === 2;
        if (isPaid) {
          return (
            <Button className={styles.receiptBtn} onClick={() => onViewReceipt(c)}>
              Comprobante
            </Button>
          );
        }
        return (
          <span style={{ color: "#e5989b", fontWeight: "bold", fontSize: "0.85rem" }}>
            Pendiente
          </span>
        );
      }
    }
  ];

  return (
    <div className={styles.tableWrapper}>
      <Table 
        data={charges}
        columns={columns}
        isLoading={isLoading}
        error={error}
        getRowKey={(c) => c.id}
      />
    </div>
  );
}