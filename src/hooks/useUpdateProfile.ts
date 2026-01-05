import { useCallback, useState } from "react";
import { updateUserProfile, type UpdateUserPayload } from "../api/users";
import { getApiErrorMessage } from "../utils/apiError";

export function useUpdateProfile(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (userId: number, payload: UpdateUserPayload) => {
      setLoading(true);
      setError(null);

      try {
        await updateUserProfile(userId, payload);
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
