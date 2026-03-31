const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function getTopics() {
  const res = await fetch(`${API_URL}/topics`);
  if (!res.ok) throw new Error("Failed to load topics");
  return res.json();
}

export async function createTopic(payload) {
  const res = await fetch(`${API_URL}/topics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create topic");
  return res.json();
}

export async function getMaterials(topicId) {
  const res = await fetch(`${API_URL}/topics/${topicId}/materials`);
  if (!res.ok) throw new Error("Failed to load materials");
  return res.json();
}

export async function createMaterial(topicId, payload) {
  const res = await fetch(`${API_URL}/topics/${topicId}/materials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create material");
  return res.json();
}

export async function askQuestion(topicId, question) {
  const res = await fetch(`${API_URL}/topics/${topicId}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("Failed to ask question");
  return res.json();
}
