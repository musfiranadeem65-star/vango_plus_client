const API_BASE_URL = "https://localhost:7270";

export interface SchoolSetting {
  id: number;
  schoolName: string;
  contactPerson: string | null;
  schoolAddress: string | null;
  monthlyAmount: number;
  senderEmail: string | null;
}

export interface UpdateSchoolSettingPayload {
  schoolName: string;
  contactPerson: string;
  schoolAddress: string;
  monthlyAmount: number;
  senderEmail: string;
}

export async function getSchoolSettings(): Promise<SchoolSetting> {
  const response = await fetch(`${API_BASE_URL}/api/school-settings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load school settings.");
  }

  return response.json();
}

export async function updateSchoolSettings(
  payload: UpdateSchoolSettingPayload
): Promise<SchoolSetting> {
  const response = await fetch(`${API_BASE_URL}/api/school-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message || "Unable to update school settings."
    );
  }

  return body;
}

export interface ChangePasswordPayload {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function changeUserPassword(
  payload: ChangePasswordPayload
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/User/change-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message || "Unable to change password."
    );
  }
}