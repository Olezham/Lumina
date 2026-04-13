import { useEffect, useMemo, useState } from "react";
import styles from "./CreateTopicModal.module.scss";

const CreateTopicModal = ({ open, onClose, onCreate, submitting }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = useMemo(
    () => title.trim().length > 0 && !submitting,
    [title, submitting],
  );

  useEffect(() => {
    if (!open) return;
    setTitle("");
    setDescription("");
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const created = await onCreate?.({
      title: title.trim(),
      description: description.trim(),
    });

    if (created) onClose?.();
  };

  if (!open) return null;

  return (
    <div
      className={styles.modalOverlay}
      onMouseDown={onClose}
      role="presentation"
    >
      <div
        className={styles.modalCard}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalKicker}>NEW KNOWLEDGE NODE</div>
            <div className={styles.modalTitle}>Create Topic</div>
            <div className={styles.modalSubtitle}>
              Initialize a new study area for Lumina to organize your PDFs,
              transcripts, and AI-generated insights.
            </div>
          </div>

          <button
            className={styles.iconClose}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className={styles.modalForm} onSubmit={submit}>
          <label className={styles.modalLabel}>
            Topic Name
            <input
              className={styles.modalInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Organic Chemistry"
            />
          </label>

          <label className={styles.modalLabel}>
            Description
            <textarea
              className={styles.modalTextarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., A study of carbon-based compounds and reactions"
              rows={5}
            />
          </label>

          <div className={styles.modalHintRow}>
            <div className={styles.modalHintLeft}>
              <span className={styles.infoDot}>i</span>
              AI will use this to refine search context
            </div>
            <div className={styles.modalCounter}>
              {Math.min(description.length, 200)} / 200
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.modalPrimaryBtn}
              disabled={!canSubmit}
            >
              {submitting ? "Creating..." : "Create Topic"}
              <span className={styles.arrow}>→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTopicModal;
