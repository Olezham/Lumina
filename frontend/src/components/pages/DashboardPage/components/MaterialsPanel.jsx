import { useState } from "react";
import styles from "../DashboardPage.module.scss";
import { AnimatePresence, motion } from "motion/react";

const MaterialsPanel = ({
  selectedTopicId,
  materials,
  materialsLoading,
  onAddMaterial,
  materialSubmitting,
}) => {
  const [materialText, setMaterialText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await onAddMaterial({ topicId: selectedTopicId, text: materialText });
    setMaterialText("");
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Materials</div>
        <div className={styles.panelMeta}>
          {materialsLoading ? "..." : `${materials.length} items`}
        </div>
      </div>

      <div className={styles.materialList}>
        {selectedTopicId ? (
          materialsLoading ? (
            <div className={styles.muted}>Loading materials...</div>
          ) : materials.length === 0 ? (
            <div className={styles.muted}>No materials yet</div>
          ) : (
            <AnimatePresence initial={false}>
              {materials.map((m) => {
                const preview = String(m.text || m.content || m.summary || "");
                const key = String(
                  m.id ?? m.created_at ?? preview.slice(0, 20),
                );

                return (
                  <motion.div
                    layout
                    key={key}
                    className={styles.materialItem}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 520, damping: 34 }}
                  >
                    <div className={styles.materialIcon}>📝</div>
                    <div className={styles.materialTextWrap}>
                      <div className={styles.materialTitle}>Material</div>
                      <div className={styles.materialSub}>
                        {preview.slice(0, 80)}
                        {preview.length > 80 ? "..." : ""}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )
        ) : (
          <div className={styles.muted}>Select a topic first</div>
        )}
      </div>

      <form className={styles.materialForm} onSubmit={submit}>
        <label className={styles.label}>
          Paste notes
          <textarea
            className={styles.textarea}
            value={materialText}
            onChange={(e) => setMaterialText(e.target.value)}
            placeholder="Paste text material for this topic..."
            rows={5}
            disabled={!selectedTopicId || materialSubmitting}
          />
        </label>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 520, damping: 30 }}
          className={styles.primaryBtn}
          disabled={!selectedTopicId || materialSubmitting}
        >
          {materialSubmitting ? "Adding..." : "Add Material"}
        </motion.button>
      </form>
    </div>
  );
};

export default MaterialsPanel;
