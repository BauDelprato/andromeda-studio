export type ChargeType = 0 | 1 | 2 | 3 | 4 | 5;
export type ChargeStatus = 0 | 1 | 2 | 3 | 4;

export interface Charge {
  id: number;
  studentId: number;
  type: ChargeType;
  amount: number;
  discountAmount: number;
  billingPeriod: string | null;
  status: ChargeStatus;
  createdAt: string;
  studentCrewId: number | null;
  priceId: number | null;
}
