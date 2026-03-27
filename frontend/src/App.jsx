import { useEffect, useState } from "react";
import { askQuestion, createMaterial, createTopic, getMaterials, getTopics } from "./api";
import "./styles.css";

export default function App() {
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [answer, setAnswer] = useState("");

  const [newTopic, setNewTopic] = useState({ title: "", description: "" });
  const [newMaterial, setNewMaterial] = useState({ title: "", content: "" });
  const [question, setQuestion] = useState("");

  async function loadTopics() {
    const data = await getTopics();
    setTopics(data);
    if (!selectedTopicId && data.length > 0) {
      setSelectedTopicId(data[0].id);
    }
  }

  async function loadMaterials(topicId) {
    if (!topicId) return;
    const data = await getMaterials(topicId);
    setMaterials(data);
  }

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    loadMaterials(selectedTopicId);
    setAnswer("");
  }, [selectedTopicId]);

  async function handleCreateTopic(event) {
    event.preventDefault();
    if (!newTopic.title.trim()) return;
    await createTopic(newTopic);
    setNewTopic({ title: "", description: "" });
    await loadTopics();
  }

  async function handleCreateMaterial(event) {
    event.preventDefault();
    if (!selectedTopicId || !newMaterial.title.trim() || !newMaterial.content.trim()) return;
    await createMaterial(selectedTopicId, newMaterial);
    setNewMaterial({ title: "", content: "" });
    await loadMaterials(selectedTopicId);
  }

  async function handleAsk(event) {
    event.preventDefault();
    if (!selectedTopicId || !question.trim()) return;
    const data = await askQuestion(selectedTopicId, question);
    setAnswer(data.answer);
  }

  return (
    <main className="container">
      <h1>Lumina</h1>
      <p>FastAPI backend + React frontend</p>

      <section className="card">
        <h2>Create topic</h2>
        <form onSubmit={handleCreateTopic}>
          <input
            placeholder="Topic title"
            value={newTopic.title}
            onChange={(e) => setNewTopic((s) => ({ ...s, title: e.target.value }))}
          />
          <textarea
            placeholder="Description"
            value={newTopic.description}
            onChange={(e) => setNewTopic((s) => ({ ...s, description: e.target.value }))}
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
              className={selectedTopicId === topic.id ? "topic active" : "topic"}
              onClick={() => setSelectedTopicId(topic.id)}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Add material</h2>
        <form onSubmit={handleCreateMaterial}>
          <input
            placeholder="Material title"
            value={newMaterial.title}
            onChange={(e) => setNewMaterial((s) => ({ ...s, title: e.target.value }))}
          />
          <textarea
            placeholder="Material content"
            value={newMaterial.content}
            onChange={(e) => setNewMaterial((s) => ({ ...s, content: e.target.value }))}
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
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about materials" />
          <button type="submit" disabled={!selectedTopicId}>Ask</button>
        </form>
        {answer && <pre>{answer}</pre>}
      </section>
    </main>
  );
}
