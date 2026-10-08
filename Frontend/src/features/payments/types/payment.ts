export type PaymentMethod = 0 | 1;

export interface Payment {
  id: number;
  studentId: number;
  amount: number;
  date: string;
  method: PaymentMethod;
  createdAt: string;
}

export interface CreatePaymentRequest {
  studentId: number;
  amount: number;
  date: string;
  method: PaymentMethod;
}