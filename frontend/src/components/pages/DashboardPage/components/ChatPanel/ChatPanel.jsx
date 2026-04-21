import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatPanel.module.scss";
import { askQuestion, getTopicHistory } from "@/api/api";

const mapHistoryToMessages = (historyItems) => {
  const items = Array.isArray(historyItems)
    ? historyItems
    : historyItems?.items || [];
  const msgs = [];

  for (const h of items) {
    const created = h?.created_at
      ? new Date(h.created_at).getTime()
      : Date.now();

    if (h?.question) {
      msgs.push({
        role: "user",
        text: h.question,
        id: `h-q-${h.id ?? created}-q`,
      });
    }
    if (h?.answer) {
      msgs.push({
        role: "assistant",
        text: h.answer,
        id: `h-a-${h.id ?? created}-a`,
      });
    }
  }

  return msgs;
};

const ChatPanel = ({ topicId, materialsCount }) => {
  const [messages, setMessages] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const typingTimerRef = useRef(null);
  const typingCancelRef = useRef({ cancelled: false });

  const shouldStickToBottomRef = useRef(true);

  const clearTypingTimer = () => {
    if (typingTimerRef.current) window.clearTimeout(typingTimerRef.current);
    typingTimerRef.current = null;
  };

  const cancelTyping = () => {
    typingCancelRef.current.cancelled = true;
    clearTypingTimer();
  };

  const isNearBottom = (el) => {
    if (!el) return true;
    const threshold = 40;
    return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  const loadHistory = async (tid) => {
    if (!tid) return;

    shouldStickToBottomRef.current = isNearBottom(listRef.current);

    setHistoryLoading(true);
    try {
      const data = await getTopicHistory(tid);
      setMessages(mapHistoryToMessages(data));
    } catch (e) {
      setMessages([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    cancelTyping();
    setMessages([]);
    setInput("");
    setSending(false);

    if (!topicId) return;
    loadHistory(topicId);
  }, [topicId]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      shouldStickToBottomRef.current = isNearBottom(el);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    if (shouldStickToBottomRef.current) scrollToBottom();
  }, [messages, historyLoading, sending]);

  useEffect(() => {
    return () => cancelTyping();
  }, []);

  const canAsk = useMemo(() => {
    return Boolean(topicId) && (materialsCount ?? 0) > 0 && !sending;
  }, [topicId, materialsCount, sending]);

  const typeAssistantAnswer = ({ messageId, fullText, onDone }) => {
    const chunkSize = 2;
    const baseDelay = 14;

    typingCancelRef.current = { cancelled: false };
    clearTypingTimer();

    let i = 0;

    const tick = () => {
      if (typingCancelRef.current.cancelled) return;

      i = Math.min(fullText.length, i + chunkSize);
      const part = fullText.slice(0, i);

      shouldStickToBottomRef.current = isNearBottom(listRef.current);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, text: part, typing: i < fullText.length }
            : m,
        ),
      );

      if (i < fullText.length) {
        typingTimerRef.current = window.setTimeout(tick, baseDelay);
      } else {
        if (typeof onDone === "function") onDone();
      }
    };

    tick();
  };

  const send = async () => {
    const q = input.trim();
    if (!q || !topicId) return;

    cancelTyping();
    setSending(true);
    setInput("");

    const localBaseId = crypto.randomUUID?.() ?? String(Date.now());
    const assistantMsgId = `local-${localBaseId}-a`;

    shouldStickToBottomRef.current = true;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: q, id: `local-${localBaseId}-q` },
      { role: "assistant", text: "", id: assistantMsgId, typing: true },
    ]);

    try {
      const res = await askQuestion(topicId, q);
      const answer = String(res?.answer ?? "No answer.");

      typeAssistantAnswer({
        messageId: assistantMsgId,
        fullText: answer,
        onDone: () => {},
      });
    } catch (e) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                typing: false,
                text: "Ошибка: не получилось получить ответ. Проверь backend и попробуй ещё раз.",
              }
            : m,
        ),
      );
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
            {historyLoading ? (
              <div className={styles.chatEmpty}>Loading history...</div>
            ) : messages.length === 0 ? (
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
                  {m.typing ? <span className={styles.typingCursor} /> : null}
                </div>
              ))
            )}
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
