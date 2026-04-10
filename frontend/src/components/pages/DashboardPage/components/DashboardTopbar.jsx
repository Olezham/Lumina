import styles from "../DashboardPage.module.scss";

const DashboardTopbar = () => {
  return (
    <header className={styles.topbar}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          className={styles.searchInput}
          placeholder="Search knowledge..."
          disabled
        />
      </div>

      <div className={styles.topbarRight}>
        <button className={styles.iconBtn} title="Notifications" disabled>
          🔔
        </button>
        <button className={styles.iconBtn} title="Help" disabled>
          ?
        </button>
        <div className={styles.avatar} title="Profile">
          🙂
        </div>
      </div>
    </header>
  );
};

export default DashboardTopbar;
