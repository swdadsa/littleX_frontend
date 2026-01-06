import { useCallback, useEffect, useState } from "react";
import { fetchRecommendFollow } from "../api/users";
import { getApiErrorMessage } from "../utils/apiError";

type RecommendUser = {
  id: number;
  name: string;
  username: string;
  description: string | null;
  avatar_path: string | null;
};

export function useRecommendFollow() {
  const [users, setUsers] = useState<RecommendUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecommendFollow();
      setUsers(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { users, loading, error, reload: load };
}
