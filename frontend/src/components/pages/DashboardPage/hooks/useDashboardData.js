import { useEffect, useMemo, useState } from "react";
import {
  createMaterial,
  createTopic,
  getMaterials,
  getTopics,
  deleteTopic,
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
      await createMaterial(topicId, {
        title: "Notes",
        content: text.trim(),
        source_type: "text",
        file_name: "",
      });
      await loadMaterials(topicId);
    } finally {
      setMaterialSubmitting(false);
    }
  };

  const removeTopic = async (topicId) => {
    if (!topicId) return;

    await deleteTopic(topicId);

    setTopics((prev) => {
      const next = prev.filter((t) => String(t.id) !== String(topicId));

      setSelectedTopicId((current) => {
        if (String(current) !== String(topicId)) return current;
        return next[0]?.id ?? null;
      });

      return next;
    });

    if (String(selectedTopicId) === String(topicId)) {
      setMaterials([]);
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
    removeTopic,
  };
};

export default useDashboardData;
