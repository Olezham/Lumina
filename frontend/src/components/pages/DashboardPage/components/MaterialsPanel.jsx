import { useMemo, useState } from "react";
import styles from "../DashboardPage.module.scss";
import { AnimatePresence, motion } from "motion/react";
import DeleteMaterialModal from "./DeleteMaterialModal/DeleteMaterialModal";

const MaterialsPanel = ({
  selectedTopicId,
  materials,
  materialsLoading,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial,
  materialSubmitting,
}) => {
  const [materialText, setMaterialText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const itemsCount = useMemo(() => materials?.length ?? 0, [materials]);

  const submit = async (e) => {
    e.preventDefault();
    await onAddMaterial({ topicId: selectedTopicId, text: materialText });
    setMaterialText("");
  };

  const startEdit = (m) => {
    const full = String(m.content || m.text || "");
    setEditingId(m.id);
    setEditingText(full);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
    setSaving(false);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editingText.trim()) return;

    setSaving(true);
    try {
      await onUpdateMaterial?.({
        topicId: selectedTopicId,
        materialId: editingId,
        text: editingText,
      });
      cancelEdit();
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (m) => {
    if (!m?.id) return;
    setDeleteTarget({
      id: m.id,
      title: (m.title || "Material").toString(),
    });
    setDeleteOpen(true);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    await onDeleteMaterial?.({
      topicId: selectedTopicId,
      materialId: deleteTarget.id,
    });

    if (String(editingId) === String(deleteTarget.id)) cancelEdit();
    closeDelete();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Materials</div>
        <div className={styles.panelMeta}>
          {materialsLoading ? "..." : `${itemsCount} items`}
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
                const isEditing = String(editingId) === String(m.id);

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
                      <div className={styles.materialRowTop}>
                        <div className={styles.materialTitle}>Material</div>

                        {m?.id ? (
                          <div className={styles.materialActions}>
                            <button
                              type="button"
                              className={styles.materialActionBtn}
                              onClick={() =>
                                isEditing ? cancelEdit() : startEdit(m)
                              }
                              title={
                                isEditing ? "Cancel edit" : "Edit material"
                              }
                              disabled={saving}
                            >
                              {isEditing ? "✕" : "✏️"}
                            </button>

                            <button
                              type="button"
                              className={styles.materialActionBtnDanger}
                              onClick={() => openDelete(m)}
                              title="Delete material"
                              disabled={saving}
                            >
                              🗑
                            </button>
                          </div>
                        ) : null}
                      </div>

                      {isEditing ? (
                        <div className={styles.materialEditBox}>
                          <textarea
                            className={styles.textarea}
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            rows={4}
                            disabled={saving}
                          />

                          <div className={styles.materialEditActions}>
                            <button
                              type="button"
                              className={styles.secondaryBtnInline}
                              onClick={cancelEdit}
                              disabled={saving}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className={styles.primaryBtnSmall}
                              onClick={saveEdit}
                              disabled={saving || !editingText.trim()}
                            >
                              {saving ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.materialSub}>
                          {preview.slice(0, 80)}
                          {preview.length > 80 ? "..." : ""}
                        </div>
                      )}
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

      <DeleteMaterialModal
        open={deleteOpen}
        materialTitle={deleteTarget?.title}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        submitting={false}
      />
    </div>
  );
};

export default MaterialsPanel;
