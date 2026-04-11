const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function authHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function getTopics() {
  const res = await fetch(`${API_URL}/topics`, {
    credentials: "include",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load topics");
  return res.json();
}

export async function createTopic(payload) {
  const res = await fetch(`${API_URL}/topics`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create topic");
  return res.json();
}

export async function getMaterials(topicId) {
  const res = await fetch(`${API_URL}/topics/${topicId}/materials`, {
    credentials: "include",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load materials");
  return res.json();
}

export async function createMaterial(topicId, payload) {
  const res = await fetch(`${API_URL}/topics/${topicId}/materials`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create material");
  return res.json();
}

export async function askQuestion(topicId, question) {
  const res = await fetch(`${API_URL}/topics/${topicId}/ask`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("Failed to ask question");
  return res.json();
}
