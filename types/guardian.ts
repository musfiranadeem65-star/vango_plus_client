export interface Guardian {
  id: number;
  userId: number;
  name: string;
  relation?: string;
  phone?: string;
  status: "Pending" | "Approved" | "Rejected";
  students?: string[];
  document?: string;
  identityDocumentPath?: string | null;
  note?: string;
  accent?: "sky" | "mint" | "rose" | string;
}

export interface GuardianStatusPayload {
  status: "Pending" | "Approved" | "Rejected";
}
