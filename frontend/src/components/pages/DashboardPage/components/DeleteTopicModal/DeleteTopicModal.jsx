import { useEffect } from "react";
import styles from "./DeleteTopicModal.module.scss";

const TrashIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M9 3h6m-8 4h10m-9 0 1 14h6l1-14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 11v7M14 11v7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const DeleteTopicModal = ({
  open,
  topicTitle,
  onClose,
  onConfirm,
  submitting,
}) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.deleteOverlay}
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        className={styles.deleteCard}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.deleteHeader}>
          <div>
            <div className={styles.deleteKicker}>CONFIRM ACTION</div>
            <div className={styles.deleteTitle}>Delete Topic</div>
            <div className={styles.deleteSubtitle}>
              Are you sure you want to delete{" "}
              <span className={styles.deleteStrong}>
                {topicTitle || "this topic"}
              </span>
              ? This action can’t be undone.
            </div>
          </div>

          <button
            className={styles.deleteClose}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.deleteBody}>
          <div className={styles.deleteNotice}>
            <span className={styles.deleteNoticeIcon}>
              <TrashIcon />
            </span>
            <div className={styles.deleteNoticeText}>
              All materials and history inside this topic will be removed.
            </div>
          </div>
        </div>

        <div className={styles.deleteFooter}>
          <button
            type="button"
            className={styles.deleteCancel}
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className={styles.deleteDanger}
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? "Deleting..." : "Delete Topic"}
            <span className={styles.deleteArrow}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTopicModal;
