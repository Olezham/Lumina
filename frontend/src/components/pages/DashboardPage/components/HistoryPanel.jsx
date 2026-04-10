import styles from "../DashboardPage.module.scss";

const HistoryPanel = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>History</div>
      </div>

      <div className={styles.historyBlock}>
        <div className={styles.historyGroupTitle}>2 hours ago</div>
        <div className={styles.historyItem}>
          <div className={styles.historyQ}>What is cellular respiration?</div>
          <div className={styles.historyA}>
            The process of converting glucose into...
          </div>
        </div>

        <div className={styles.historyGroupTitle}>Yesterday</div>
        <div className={styles.historyItem}>
          <div className={styles.historyQ}>Plasma ыmembrane structure</div>
          <div className={styles.historyA}>
            The fluid mosaic model explains how lipids...
          </div>
        </div>

        <button className={styles.linkBtn} disabled>
          View all activity
        </button>
      </div>
    </div>
  );
};

export default HistoryPanel;
