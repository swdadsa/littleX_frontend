import { useCallback, useEffect, useRef, useState } from "react";
import { deletePost, fetchPosts, togglePostLike, type Post } from "../api/posts";
import { getApiErrorMessage } from "../utils/apiError";

export function usePosts(enabled = true, userId?: number) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likeLoadingId, setLikeLoadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const snapshotRef = useRef<Post[] | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPosts(userId);
      setPosts(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!enabled) {
      setPosts([]);
      setError(null);
      setLoading(false);
      return;
    }

    loadPosts();
  }, [enabled, loadPosts]);

  const toggleLike = useCallback(async (postId: number) => {
    if (!enabled) {
      return;
    }
    setLikeLoadingId(postId);
    setError(null);

    setPosts((prev) => {
      snapshotRef.current = prev;
      return prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              youalreadyliked: !post.youalreadyliked,
              likes_count: post.youalreadyliked
                ? post.likes_count - 1
                : post.likes_count + 1
            }
          : post
      );
    });

    try {
      await togglePostLike(postId);
    } catch (err) {
      if (snapshotRef.current) {
        setPosts(snapshotRef.current);
      }
      setError(getApiErrorMessage(err));
    } finally {
      setLikeLoadingId(null);
    }
  }, [enabled]);

  const removePost = useCallback(async (postId: number) => {
    setDeletingId(postId);
    setError(null);
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setDeletingId(null);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    reload: loadPosts,
    toggleLike,
    likeLoadingId,
    removePost,
    deletingId
  };
}
