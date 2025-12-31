import { useCallback, useEffect, useState } from "react";
import {
  createComment,
  fetchComments,
  toggleCommentLike,
  type Comment
} from "../api/comments";
import { getApiErrorMessage } from "../utils/apiError";

export function useComments(postId: number, enabled: boolean) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchComments(postId);
      setComments(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (enabled) {
      loadComments();
    }
  }, [enabled, loadComments]);

  return { comments, loading, error, reload: loadComments };
}

export function useCommentActions(postId: number, reload: () => void) {
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const likeComment = useCallback(
    async (commentId: number) => {
      setActionLoadingId(commentId);
      setError(null);

      try {
        await toggleCommentLike(commentId);
        reload();
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setActionLoadingId(null);
      }
    },
    [reload]
  );

  const addComment = useCallback(
    async (comment: string) => {
      setCreating(true);
      setError(null);

      try {
        await createComment(postId, comment);
        reload();
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setCreating(false);
      }
    },
    [postId, reload]
  );

  return { likeComment, addComment, actionLoadingId, creating, error };
}
