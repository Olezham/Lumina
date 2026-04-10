import { useEffect, useMemo, useState } from "react";
import {
  createMaterial,
  createTopic,
  getMaterials,
  getTopics,
} from "@/api/api";

const useDashboardData = () => {
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(true);

  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const selectedTopic = useMemo(
    () => topics.find((t) => String(t.id) === String(selectedTopicId)) || null,
    [topics, selectedTopicId],
  );

  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  const [topicSubmitting, setTopicSubmitting] = useState(false);
  const [materialSubmitting, setMaterialSubmitting] = useState(false);

  const loadTopics = async () => {
    setTopicsLoading(true);
    try {
      const data = await getTopics();
      const items = Array.isArray(data) ? data : data?.items || [];
      setTopics(items);

      const first = items[0];
      setSelectedTopicId((prev) => prev ?? first?.id ?? null);
    } finally {
      setTopicsLoading(false);
    }
  };

  const loadMaterials = async (topicId) => {
    if (!topicId) return;
    setMaterialsLoading(true);
    try {
      const data = await getMaterials(topicId);
      setMaterials(Array.isArray(data) ? data : data?.items || []);
    } finally {
      setMaterialsLoading(false);
    }
  };

  const createNewTopic = async ({ title, description }) => {
    if (!title?.trim()) return null;
    setTopicSubmitting(true);
    try {
      const created = await createTopic({
        title: title.trim(),
        description: description?.trim() || "",
      });

      await loadTopics();
      if (created?.id) setSelectedTopicId(created.id);

      return created;
    } finally {
      setTopicSubmitting(false);
    }
  };

  const addMaterialToTopic = async ({ topicId, text }) => {
    if (!topicId) return;
    if (!text?.trim()) return;

    setMaterialSubmitting(true);
    try {
      await createMaterial(topicId, { text: text.trim() });
      await loadMaterials(topicId);
    } finally {
      setMaterialSubmitting(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    if (!selectedTopicId) return;
    loadMaterials(selectedTopicId);
  }, [selectedTopicId]);

  return {
    topics,
    topicsLoading,
    selectedTopicId,
    setSelectedTopicId,
    selectedTopic,

    materials,
    materialsLoading,

    topicSubmitting,
    materialSubmitting,

    loadTopics,
    loadMaterials,
    createNewTopic,
    addMaterialToTopic,
  };
};

export default useDashboardData;
