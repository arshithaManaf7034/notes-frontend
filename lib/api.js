const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, method = "GET", body, token) {
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
