import { useState } from "react";
import styles from "../DashboardPage.module.scss";

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
            materials.map((m) => {
              const preview = String(m.text || m.content || m.summary || "");
              return (
                <div
                  key={m.id ?? m.created_at ?? preview.slice(0, 20)}
                  className={styles.materialItem}
                >
                  <div className={styles.materialIcon}>📝</div>
                  <div className={styles.materialTextWrap}>
                    <div className={styles.materialTitle}>Material</div>
                    <div className={styles.materialSub}>
                      {preview.slice(0, 80)}
                      {preview.length > 80 ? "..." : ""}
                    </div>
                  </div>
                </div>
              );
            })
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
        <button
          className={styles.primaryBtn}
          disabled={!selectedTopicId || materialSubmitting}
        >
          {materialSubmitting ? "Adding..." : "Add Material"}
        </button>
      </form>
    </div>
  );
};

export default MaterialsPanel;
