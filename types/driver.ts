export interface Driver {
  id: number;
  name: string;
  phone: string;
  email: string;
  licenseNo: string;
  status: "Active" | "Inactive" | "On Leave";
}
