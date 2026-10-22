import { useMemo, useState } from "react";
import type { Crew } from "@/features/crews/types/crew";
import type { PaymentDashboardRow } from "../types/paymentViews";
import { PaymentDialog } from "./PaymentDialog";
import styles from "./OverdueCrewDialog.module.css";

interface OverdueCrewDialogProps {
  rows: PaymentDashboardRow[];
  crews: Crew[];
  onClose: () => void;
}

export function OverdueCrewDialog({ rows, crews, onClose }: OverdueCrewDialogProps) {
  const [selectedCrewId, setSelectedCrewId] = useState("all");
  const filteredRows = useMemo(
    () =>
      selectedCrewId === "all"
        ? rows
        : rows.filter((row) => String(row.crewId) === selectedCrewId),
    [rows, selectedCrewId],
  );
  const students = useMemo(() => {
    const grouped = new Map<number, { name: string; crews: Set<string>; count: number }>();
    filteredRows.forEach((row) => {
      const current = grouped.get(row.studentId) ?? {
        name: row.studentName,
        crews: new Set<string>(),
        count: 0,
      };
      if (row.crewName) current.crews.add(row.crewName);
      current.count += 1;
      grouped.set(row.studentId, current);
    });
    return Array.from(grouped.entries()).map(([studentId, value]) => ({
      studentId,
      name: value.name,
      crews: Array.from(value.crews),
      count: value.count,
    }));
  }, [filteredRows]);

  return (
    <PaymentDialog title="Pagos atrasados" onClose={onClose} className={styles.dialog}>
      <label className={styles.crewFilter}>
        <span>Crew</span>
        <select value={selectedCrewId} onChange={(event) => setSelectedCrewId(event.target.value)}>
          <option value="all">Todas las crews</option>
          {crews.map((crew) => (
            <option key={crew.id} value={String(crew.id)}>
              {crew.name}
            </option>
          ))}
        </select>
      </label>

      {students.length > 0 ? (
        <div className={styles.list}>
          {students.map((student) => (
            <article key={student.studentId} className={styles.studentRow}>
              <span>
                <strong>{student.name}</strong>
                <small>
                  {student.crews.length > 0 ? student.crews.join(", ") : "Sin crew asociada"}
                  {student.count > 1 ? " · " + student.count + " cargos" : ""}
                </small>
              </span>
            </article>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No hay alumnos atrasados para esta crew.</p>
      )}
    </PaymentDialog>
  );
}
