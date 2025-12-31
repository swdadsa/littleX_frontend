import { useCallback, useState } from "react";
import { login, type LoginPayload, type LoginResponse } from "../api/auth";
import { getApiErrorMessage } from "../utils/apiError";
import { setUser } from "../utils/user";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);

    try {
      const data: LoginResponse = await login(payload);
      const { token, ...user } = data.data;
      setUser(user);
      return data;
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login: loginUser, loading, error };
}
