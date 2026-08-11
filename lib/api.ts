import type { Analysis } from "./types";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(
    /\/$/,
    ""
  );

export const DEMO_CREDENTIALS = {
  email: "test@clearview.dev",
  password: "Demo123!",
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }
  const data = (body as { data?: T }).data as T;
  return data;
}

export async function apiLogin(
  email: string,
  password: string
): Promise<{ token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse<{ token: string }>(res);
}

export async function apiAnalyze(
  token: string,
  url: string
): Promise<Analysis> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  });
  return parseResponse<Analysis>(res);
}

export async function apiDemo(): Promise<Analysis> {
  const res = await fetch(`${API_BASE}/analysis/demo`);
  return parseResponse<Analysis>(res);
}

export async function apiGetAnalysis(
  token: string,
  id: string
): Promise<Analysis> {
  const res = await fetch(`${API_BASE}/analysis/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return parseResponse<Analysis>(res);
}

export async function downloadPdf(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/analysis/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new ApiError(res.status, `PDF export failed (${res.status})`);
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = `clearview-report-${id}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}
