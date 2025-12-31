import api from "./client";

export type UserSummary = {
  id: number;
  email: string;
  name: string;
  username: string;
  description: string | null;
  follower_count: number;
  following_count: number;
  posts_count: number;
  avatar_path: string | null;
};

export type UserSearchResponse = {
  status: boolean;
  data: UserSummary[];
};

export async function searchUsers(username: string) {
  const response = await api.get<UserSearchResponse>("/user/getByUsername", {
    params: { username }
  });

  if (!response.data.status) {
    throw new Error("Failed to search users");
  }

  return response.data.data;
}

export async function fetchUserByUsername(username: string) {
  const users = await searchUsers(username);
  return users.find((user) => user.username === username) ?? users[0] ?? null;
}
