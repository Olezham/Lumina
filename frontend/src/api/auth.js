const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw {
      response: { status: res.status, statusText: res.statusText, data: err },
    };
  }
  return res.json();
}

export async function registerUser(credentials) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw {
      response: { status: res.status, statusText: res.statusText, data: err },
    };
  }
  return res.json();
}

export async function fetchUser() {
  const res = await fetch(`${API_URL}/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to logout");
  return res.json();
}
