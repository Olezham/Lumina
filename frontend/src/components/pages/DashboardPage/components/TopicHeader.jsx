import styles from "../DashboardPage.module.scss";

const TopicHeader = ({ topic }) => {
  if (!topic) {
    return (
      <div className={styles.emptyState}>
        <h2>Select a topic</h2>
        <p>Create a new topic or pick one from the left sidebar.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.breadcrumb}>
        <span className={styles.crumbMuted}>TOPIC</span>
        <span className={styles.crumbDot}>›</span>
        <span className={styles.crumbStrong}>{topic.title}</span>
      </div>

      <h1 className={styles.topicTitle}>{topic.title}</h1>
      <p className={styles.topicDesc}>
        {topic.description || "No description yet."}
      </p>

      <div className={styles.placeholderCard}>
        <div className={styles.placeholderHeader}>
          <span className={styles.badge}>AI Insights</span>
          <span className={styles.placeholderSub}>
            curated from uploaded materials
          </span>
        </div>
        <div className={styles.placeholderBody}>
          Пока без чата/ответов — добавь материалы справа, и дальше подключим
          чат.
        </div>
      </div>
    </>
  );
};

export default TopicHeader;
