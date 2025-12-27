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
  avatar_path: string | null;
  email_verified_at: string | null;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type LoginResponse = {
  status: boolean;
  data: {
    user: User;
    token: string;
  };
};

export async function login(payload: LoginPayload) {
  const response = await api.post<LoginResponse>("/user/login", payload);

  if (!response.data.status) {
    throw new Error("Login failed");
  }

  setToken(response.data.data.token);
  return response.data;
}