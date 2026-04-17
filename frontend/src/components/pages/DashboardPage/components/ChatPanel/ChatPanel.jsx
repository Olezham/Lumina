import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatPanel.module.scss";
import { askQuestion } from "@/api/api";

const ChatPanel = ({ topicId, materialsCount }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    setMessages([]);
    setInput("");
    setSending(false);
  }, [topicId]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, sending]);

  const canAsk = useMemo(() => {
    return Boolean(topicId) && (materialsCount ?? 0) > 0 && !sending;
  }, [topicId, materialsCount, sending]);

  const send = async () => {
    const q = input.trim();
    if (!q || !topicId) return;

    setSending(true);
    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: q,
        id: crypto.randomUUID?.() ?? String(Date.now()),
      },
    ]);

    try {
      const res = await askQuestion(topicId, q);
      const answer = res?.answer ?? "No answer.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: answer,
          id: crypto.randomUUID?.() ?? String(Date.now() + 1),
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Ошибка: не получилось получить ответ. Проверь backend и попробуй ещё раз.",
          id: crypto.randomUUID?.() ?? String(Date.now() + 2),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canAsk) send();
    }
  };

  return (
    <div className={styles.chatCard}>
      <div className={styles.chatHeader}>
        <span className={styles.badge}>AI Insights</span>
        <span className={styles.placeholderSub}>
          curated from uploaded materials
        </span>
      </div>

      {(materialsCount ?? 0) === 0 ? (
        <div className={styles.placeholderBody}>
          No chat/answers yet - add case materials, and then we'll connect the
          chat.
        </div>
      ) : (
        <>
          <div className={styles.chatList} ref={listRef}>
            {messages.length === 0 ? (
              <div className={styles.chatEmpty}>
                Ask questions about the materials in this topic - I answer only
                based on the uploaded data.
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`${styles.chatMsg} ${
                    m.role === "user"
                      ? styles.chatMsgUser
                      : styles.chatMsgAssistant
                  }`}
                >
                  {m.text}
                </div>
              ))
            )}

            {sending ? (
              <div className={`${styles.chatMsg} ${styles.chatMsgAssistant}`}>
                Thinking...
              </div>
            ) : null}
          </div>

          <div className={styles.chatComposer}>
            <textarea
              className={styles.chatInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask anything"
              rows={2}
              disabled={!topicId || (materialsCount ?? 0) === 0}
            />

            <button
              type="button"
              className={styles.chatSendIconBtn}
              onClick={send}
              disabled={!canAsk || input.trim().length === 0}
              aria-label="Send message"
              title="Send"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M21 3 10.5 13.5M21 3l-6.8 18-3.2-7.2L3 10.6 21 3Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;
