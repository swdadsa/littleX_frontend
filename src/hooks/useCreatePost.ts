import { useCallback, useState } from "react";
import { createPost } from "../api/posts";
import { getApiErrorMessage } from "../utils/apiError";

export function useCreatePost(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (body: string) => {
      setLoading(true);
      setError(null);

      try {
        await createPost(body);
        onSuccess?.();
      } catch (err) {
        setError(getApiErrorMessage(err));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  return { submit, loading, error };
}
