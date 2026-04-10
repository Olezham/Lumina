import { useState } from "react";
import styles from "./DashboardPage.module.scss";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

import DashboardTopbar from "./components/DashboardTopbar";
import DashboardSidebar from "./components/DashboardSidebar";
import TopicHeader from "./components/TopicHeader";
import MaterialsPanel from "./components/MaterialsPanel";
import HistoryPanel from "./components/HistoryPanel";
import CreateTopicModal from "./components/CreateTopicModal";
import useDashboardData from "./hooks/useDashboardData";

const DashboardPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [createOpen, setCreateOpen] = useState(false);

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
  } = useDashboardData();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={styles.page}>
      <DashboardSidebar
        topics={topics}
        topicsLoading={topicsLoading}
        selectedTopicId={selectedTopicId}
        onSelectTopic={setSelectedTopicId}
        onOpenCreateTopic={() => setCreateOpen(true)}
        onLogout={handleLogout}
      />

      <main className={styles.main}>
        <DashboardTopbar />

        <div className={styles.content}>
          <section className={styles.center}>
            <TopicHeader topic={selectedTopic} />
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
    </div>
  );
};

export default DashboardPage;
