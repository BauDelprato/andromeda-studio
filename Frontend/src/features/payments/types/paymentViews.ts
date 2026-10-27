import type { Charge } from "./charge";

export interface PaymentDashboardRow {
  id: number;
  charge: Charge;
  studentId: number;
  studentName: string;
  crewId: number | null;
  crewName: string;
}
