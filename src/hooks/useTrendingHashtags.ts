import { useCallback, useEffect, useState } from "react";
import { fetchTrendingHashtags, type TrendingHashtag } from "../api/posts";
import { getApiErrorMessage } from "../utils/apiError";

export function useTrendingHashtags() {
  const [hashtags, setHashtags] = useState<TrendingHashtag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrendingHashtags();
      setHashtags(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { hashtags, loading, error, reload: load };
}
