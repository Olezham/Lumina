import styles from "../DashboardPage.module.scss";
import ChatPanel from "./ChatPanel/ChatPanel";

const TopicHeader = ({ topic, topicId, materialsCount }) => {
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

      <ChatPanel topicId={topicId} materialsCount={materialsCount} />
    </>
  );
};

export default TopicHeader;
