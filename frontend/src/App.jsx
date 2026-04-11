import React, { useEffect, useState } from "react";
import {
  askQuestion,
  createMaterial,
  createTopic,
  getCurrentUser,
  getMaterials,
  getTopics,
  login,
  logout,
  register,
} from "./api";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [answer, setAnswer] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState("");

  const [newTopic, setNewTopic] = useState({ title: "", description: "" });
  const [newMaterial, setNewMaterial] = useState({ title: "", content: "" });
  const [question, setQuestion] = useState("");

  async function loadTopics() {
    if (!user) {
      setTopics([]);
      setSelectedTopicId(null);
      return;
    }
    const data = await getTopics();
    setTopics(data);
    if (data.length === 0) {
      setSelectedTopicId(null);
      setMaterials([]);
      return;
    }
    if (!data.some((topic) => topic.id === selectedTopicId)) {
      setSelectedTopicId(data[0].id);
    }
  }

  async function loadMaterials(topicId) {
    if (!topicId || !user) {
      setMaterials([]);
      return;
    }
    const data = await getMaterials(topicId);
    setMaterials(data);
  }

  useEffect(() => {
    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        if (err.status !== 401) {
          setError(err.message || "Failed to restore session");
        }
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    if (!authLoading) {
      loadTopics().catch((err) => {
        setError(err.message || "Failed to load topics");
      });
    }
  }, [user, authLoading]);

  useEffect(() => {
    loadMaterials(selectedTopicId).catch((err) => {
      setError(err.message || "Failed to load materials");
    });
    setAnswer("");
  }, [selectedTopicId]);

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const action = authMode === "login" ? login : register;
      const data = await action(authForm);
      if (authMode === "register") {
        const loginData = await login(authForm);
        setUser(loginData.user);
      } else {
        setUser(data.user);
      }
      setAuthForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  }

  async function handleCreateTopic(event) {
    event.preventDefault();
    if (!newTopic.title.trim()) return;
    setError("");
    try {
      const topic = await createTopic(newTopic);
      setNewTopic({ title: "", description: "" });
      await loadTopics();
      setSelectedTopicId(topic.id);
    } catch (err) {
      setError(err.message || "Failed to create topic");
    }
  }

  async function handleCreateMaterial(event) {
    event.preventDefault();
    if (
      !selectedTopicId ||
      !newMaterial.title.trim() ||
      !newMaterial.content.trim()
    )
      return;
    setError("");
    try {
      await createMaterial(selectedTopicId, newMaterial);
      setNewMaterial({ title: "", content: "" });
      await loadMaterials(selectedTopicId);
    } catch (err) {
      setError(err.message || "Failed to create material");
    }
  }

  async function handleAsk(event) {
    event.preventDefault();
    if (!selectedTopicId || !question.trim()) return;
    setError("");
    try {
      const data = await askQuestion(selectedTopicId, question);
      setAnswer(data.answer);
    } catch (err) {
      setError(err.message || "Failed to ask question");
    }
  }

  async function handleLogout() {
    setError("");
    try {
      await logout();
      setUser(null);
      setTopics([]);
      setMaterials([]);
      setSelectedTopicId(null);
      setAnswer("");
    } catch (err) {
      setError(err.message || "Failed to log out");
    }
  }

  if (authLoading) {
    return (
      <main className="container">
        <h1>Lumina</h1>
        <p>Restoring session...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>Lumina</h1>
      <p>FastAPI backend + React frontend</p>

      {error && <p className="error">{error}</p>}

      {!user ? (
        <section className="card">
          <div className="row auth-toggle">
            <button
              type="button"
              className={authMode === "login" ? "topic active" : "topic"}
              onClick={() => setAuthMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={authMode === "register" ? "topic active" : "topic"}
              onClick={() => setAuthMode("register")}
            >
              Register
            </button>
          </div>
          <form onSubmit={handleAuthSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(e) =>
                setAuthForm((s) => ({ ...s, email: e.target.value }))
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm((s) => ({ ...s, password: e.target.value }))
              }
            />
            <button type="submit">
              {authMode === "login" ? "Login" : "Create account"}
            </button>
          </form>
        </section>
      ) : (
        <section className="card">
          <div className="toolbar">
            <div>
              <h2>Signed in</h2>
              <p>{user.email}</p>
            </div>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </section>
      )}

      {user && (
        <>
          <section className="card">
            <h2>Create topic</h2>
            <form onSubmit={handleCreateTopic}>
              <input
                placeholder="Topic title"
                value={newTopic.title}
                onChange={(e) =>
                  setNewTopic((s) => ({ ...s, title: e.target.value }))
                }
              />
              <textarea
                placeholder="Description"
                value={newTopic.description}
                onChange={(e) =>
                  setNewTopic((s) => ({ ...s, description: e.target.value }))
                }
              />
              <button type="submit">Create topic</button>
            </form>
          </section>

          <section className="card">
            <h2>Topics</h2>
            <div className="row">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  className={
                    selectedTopicId === topic.id ? "topic active" : "topic"
                  }
                  onClick={() => setSelectedTopicId(topic.id)}
                >
                  {topic.title}
                </button>
              ))}
            </div>
            {topics.length === 0 && <p>No topics yet for this account.</p>}
          </section>

          <section className="card">
            <h2>Add material</h2>
            <form onSubmit={handleCreateMaterial}>
              <input
                placeholder="Material title"
                value={newMaterial.title}
                onChange={(e) =>
                  setNewMaterial((s) => ({ ...s, title: e.target.value }))
                }
              />
              <textarea
                placeholder="Material content"
                value={newMaterial.content}
                onChange={(e) =>
                  setNewMaterial((s) => ({ ...s, content: e.target.value }))
                }
              />
              <button type="submit" disabled={!selectedTopicId}>
                Add material
              </button>
            </form>

            <ul>
              {materials.map((material) => (
                <li key={material.id}>
                  <strong>{material.title}:</strong> {material.content}
                </li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2>Ask question</h2>
            <form onSubmit={handleAsk}>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about materials"
              />
              <button type="submit" disabled={!selectedTopicId}>
                Ask
              </button>
            </form>
            {answer && <pre>{answer}</pre>}
          </section>
        </>
      )}
    </main>
  );
}
