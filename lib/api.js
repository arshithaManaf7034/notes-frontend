const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(path, method = "GET", body, token) {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(
      data.detail ||
      data.message ||
      `Request failed with status ${res.status}`
    );
  }

  return data;
}
