import { useMemo, useState } from "react";
import styles from "./DashboardPage.module.scss";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

import DashboardTopbar from "./components/DashboardTopbar";
import DashboardSidebar from "./components/DashboardSidebar";
import TopicHeader from "./components/TopicHeader";
import MaterialsPanel from "./components/MaterialsPanel";
import HistoryPanel from "./components/HistoryPanel/HistoryPanel";
import CreateTopicModal from "./components/CreateTopicModal/CreateTopicModal";
import DeleteTopicModal from "./components/DeleteTopicModal/DeleteTopicModal";
import useDashboardData from "./hooks/useDashboardData";

const DashboardPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);

  const {
    topics,
    topicsLoading,
    selectedTopicId,
    setSelectedTopicId,
    selectedTopic,

    materials,
    materialsLoading,

    topicSubmitting,
    materialSubmitting,

    createNewTopic,
    addMaterialToTopic,
    removeTopic,
  } = useDashboardData();

  const deleteTitle = useMemo(() => {
    if (topicToDelete?.title) return topicToDelete.title;
    const t = topics.find((x) => String(x.id) === String(topicToDelete?.id));
    return t?.title || "";
  }, [topicToDelete, topics]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const openDelete = (topicId) => {
    const t = topics.find((x) => String(x.id) === String(topicId));
    setTopicToDelete({ id: topicId, title: t?.title || "" });
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!topicToDelete?.id) return;
    await removeTopic(topicToDelete.id);
    setDeleteOpen(false);
    setTopicToDelete(null);
  };

  return (
    <div className={styles.page}>
      <DashboardSidebar
        topics={topics}
        topicsLoading={topicsLoading}
        selectedTopicId={selectedTopicId}
        onSelectTopic={setSelectedTopicId}
        onOpenCreateTopic={() => setCreateOpen(true)}
        onDeleteTopic={openDelete}
        onLogout={handleLogout}
      />

      <main className={styles.main}>
        <DashboardTopbar />

        <div className={styles.content}>
          <section className={styles.center}>
            <TopicHeader
              topic={selectedTopic}
              topicId={selectedTopicId}
              materialsCount={materials?.length ?? 0}
            />
          </section>

          <aside className={styles.right}>
            <div className={styles.rightStack}>
              <HistoryPanel />
              <MaterialsPanel
                selectedTopicId={selectedTopicId}
                materials={materials}
                materialsLoading={materialsLoading}
                onAddMaterial={addMaterialToTopic}
                materialSubmitting={materialSubmitting}
              />
            </div>
          </aside>
        </div>
      </main>

      <CreateTopicModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createNewTopic}
        submitting={topicSubmitting}
      />

      <DeleteTopicModal
        open={deleteOpen}
        topicTitle={deleteTitle}
        onClose={() => {
          setDeleteOpen(false);
          setTopicToDelete(null);
        }}
        onConfirm={confirmDelete}
        submitting={false}
      />
    </div>
  );
};

export default DashboardPage;
