const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  } catch (err) {
    console.error("Invalid JSON from backend:", text);
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
  console.error("STATUS:", res.status);
  console.error("RAW RESPONSE:", text);
  console.error("PARSED DATA:", data);

  throw new Error(
    data.detail ||
    data.message ||
    `Request failed with status ${res.status}`
  );
}


  return data;
}
