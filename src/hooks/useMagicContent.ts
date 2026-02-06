import { useState, useCallback } from "react";
import type { MagicContent, MagicContentType } from "../types";
import { MAGIC_CHALLENGES, MAGIC_STORIES } from "../data/constants";

export function useMagicContent() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<MagicContent | null>(null);
  const [showModal, setShowModal] = useState(false);

  const generate = useCallback((type: MagicContentType) => {
    setLoading(true);
    setContent(null);
    setShowModal(true);

    // Simulate "thinking" time for magical effect
    setTimeout(() => {
      const pool =
        type === "challenge" ? MAGIC_CHALLENGES : MAGIC_STORIES;
      const text = pool[Math.floor(Math.random() * pool.length)];
      setContent({ type, text });
      setLoading(false);
    }, 1500);
  }, []);

  const closeModal = useCallback(() => setShowModal(false), []);

  return { loading, content, showModal, generate, closeModal } as const;
}
