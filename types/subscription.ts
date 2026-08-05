export interface Subscription {
  id: number;
  parentName: string;
  studentName?: string;
  planName?: string;
  price?: string | number;
  status: "Paid" | "Pending" | "Overdue" | string;
  startedAt?: string; // ISO date
  paymentMethod?: string;
  // other optional fields returned by the API
  [key: string]: any;
}

export interface SubscriptionStatusPayload {
  status: string;
}
