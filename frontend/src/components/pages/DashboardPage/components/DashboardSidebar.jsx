import styles from "../DashboardPage.module.scss";
import { useNavigate } from "react-router-dom";

const HelpIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M9.8 9.2A2.4 2.4 0 0 1 12 7.6c1.325 0 2.4 1.075 2.4 2.4 0 1.2-.8 1.8-1.6 2.3-.7.45-1.2.85-1.2 1.7v.4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M12 17.3h.01"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);

const LogoutIcon = (props) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    {...props}
  >
    <path
      d="M10 7V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-1"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M4 12h10"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M7 9l-3 3 3 3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DashboardSidebar = ({
  topics,
  topicsLoading,
  selectedTopicId,
  onSelectTopic,
  onOpenCreateTopic,
  onDeleteTopic,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleHelp = (e) => {
    e.preventDefault();
    navigate("/help");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandTitle}>Lumina</div>
        <div className={styles.brandSub}>AI KNOWLEDGE BASE</div>
      </div>

      <button className={styles.newTopicBtn} onClick={onOpenCreateTopic}>
        <span className={styles.plus}>＋</span> New Topic
      </button>

      <div className={styles.sectionTitle}>My Topics</div>

      <div className={styles.topicList}>
        {topicsLoading ? (
          <div className={styles.muted}>Loading topics...</div>
        ) : topics.length === 0 ? (
          <div className={styles.muted}>No topics yet</div>
        ) : (
          topics.map((t) => {
            const active = String(t.id) === String(selectedTopicId);

            return (
              <div
                key={t.id}
                className={`${styles.topicItem} ${active ? styles.active : ""}`}
              >
                <button
                  type="button"
                  className={styles.topicSelectBtn}
                  onClick={() => onSelectTopic(t.id)}
                  title={t.title}
                >
                  <span className={styles.topicIcon}>📁</span>
                  <span className={styles.topicText}>{t.title}</span>
                </button>

                <button
                  type="button"
                  className={styles.topicDeleteBtn}
                  title="Delete topic"
                  onClick={() => onDeleteTopic?.(t.id)}
                >
                  🗑
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className={styles.sidebarBottom}>
        <button
          className={styles.sidebarAction}
          type="button"
          onClick={handleHelp}
        >
          <span className={styles.sidebarActionIcon}>
            <HelpIcon />
          </span>
          <span className={styles.sidebarActionText}>Help Center</span>
        </button>

        <button
          className={styles.sidebarAction}
          type="button"
          onClick={onLogout}
        >
          <span className={styles.sidebarActionIcon}>
            <LogoutIcon />
          </span>
          <span className={styles.sidebarActionText}>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
