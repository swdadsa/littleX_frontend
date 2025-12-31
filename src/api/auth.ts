import api from "./client";
import { setToken } from "../utils/token";

export type LoginPayload = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  email: string;
  name: string;
  username: string;
  description: string | null;
  follower_count: number;
  following_count: number;
  posts_count: number;
  avatar_path: string | null;
  cover_path: string | null;
};

export type LoginResponse = {
  status: boolean;
  data: User & { token: string };
};

export async function login(payload: LoginPayload) {
  const response = await api.post<LoginResponse>("/user/login", payload);

  if (!response.data.status) {
    throw new Error("Login failed");
  }

  setToken(response.data.data.token);
  return response.data;
}
