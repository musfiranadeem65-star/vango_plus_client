import type { Student } from "@/types/student";

const API_BASE_URL = "https://localhost:7270";

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(`${API_BASE_URL}/api/Student`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load students from the backend.");
  }

  return response.json();
}

interface StudentUpdatePayload {
  parentUserId: number;
  name: string;
  grade: string;
  section: string;
  status: string;
}

export async function updateStudent(id: number, payload: StudentUpdatePayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/Student/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status !== 204) {
    let errorMessage = "Unable to update student.";
    try {
      const body = await response.json();
      if (body?.message) {
        errorMessage = body.message;
      }
    } catch {
      // Ignore invalid JSON response
    }
    throw new Error(errorMessage);
  }
}
