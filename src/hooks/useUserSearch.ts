import { useCallback, useEffect, useMemo, useState } from "react";
import { searchUsers, type UserSummary } from "../api/users";
import { getApiErrorMessage } from "../utils/apiError";

export function useUserSearch(query: string) {
  const [results, setResults] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = useMemo(() => query.trim(), [query]);

  const runSearch = useCallback(async () => {
    if (!trimmed) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchUsers(trimmed);
      setResults(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [trimmed]);

  useEffect(() => {
    if (!trimmed) {
      setResults([]);
      setError(null);
      return;
    }

    const handle = window.setTimeout(() => {
      runSearch();
    }, 350);

    return () => window.clearTimeout(handle);
  }, [trimmed, runSearch]);

  return { results, loading, error, query: trimmed };
}
