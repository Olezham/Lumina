import styles from "../DashboardPage.module.scss";

const DashboardSidebar = ({
  topics,
  topicsLoading,
  selectedTopicId,
  onSelectTopic,

  onOpenCreateTopic,

  onLogout,
}) => {
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
              <button
                key={t.id}
                className={`${styles.topicItem} ${active ? styles.active : ""}`}
                onClick={() => onSelectTopic(t.id)}
                title={t.title}
              >
                <span className={styles.topicIcon}>📁</span>
                <span className={styles.topicText}>{t.title}</span>
              </button>
            );
          })
        )}
      </div>

      <div className={styles.sidebarBottom}>
        <button className={styles.logoutBtn} onClick={onLogout}>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
