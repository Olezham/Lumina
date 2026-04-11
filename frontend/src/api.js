const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = res.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) {
    const message = payload?.detail || payload?.message || "Request failed";
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return payload;
}

export async function getTopics() {
  return request("/topics", { method: "GET" });
}

export async function createTopic(payload) {
  return request("/topics", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMaterials(topicId) {
  return request(`/topics/${topicId}/materials`, { method: "GET" });
}

export async function createMaterial(topicId, payload) {
  return request(`/topics/${topicId}/materials`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function askQuestion(topicId, question) {
  return request(`/topics/${topicId}/ask`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function register(payload) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  return request("/me", { method: "GET" });
}

export async function logout() {
  return request("/logout", { method: "POST" });
}
