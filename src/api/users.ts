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
  cover_path?: string | null;
  is_myself?: boolean;
  is_follow?: boolean;
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

export type UserDetailResponse = {
  status: boolean;
  data: UserSummary[];
};

export async function fetchUserById(userId: number) {
  const response = await api.get<UserDetailResponse>(`/user/${userId}`);

  if (!response.data.status) {
    throw new Error("Failed to load user");
  }

  return response.data.data[0] ?? null;
}

export type FollowResponse = {
  status: boolean;
  data: string;
};

export async function followUser(userId: number) {
  const response = await api.post<FollowResponse>("/follow", {
    follow_user_id: userId
  });

  if (!response.data.status) {
    throw new Error("Failed to follow user");
  }

  return response.data.data;
}

export async function unfollowUser(userId: number) {
  const response = await api.delete<FollowResponse>("/follow", {
    data: { follow_user_id: userId }
  });

  if (!response.data.status) {
    throw new Error("Failed to unfollow user");
  }

  return response.data.data;
}

export type UpdateUserResponse = {
  status: boolean;
  data: string;
};

export type UpdateUserPayload = {
  email: string;
  name: string;
  username: string;
  description: string;
  avatar_image?: File | null;
  cover_image?: File | null;
};

export async function updateUserProfile(
  userId: number,
  payload: UpdateUserPayload
) {
  const form = new FormData();
  form.append("email", payload.email);
  form.append("name", payload.name);
  form.append("username", payload.username);
  form.append("description", payload.description ?? "");

  if (payload.avatar_image) {
    form.append("avatar_image", payload.avatar_image);
  }
  if (payload.cover_image) {
    form.append("cover_image", payload.cover_image);
  }

  const response = await api.post<UpdateUserResponse>(`/user/${userId}`, form, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  if (!response.data.status) {
    throw new Error("Failed to update profile");
  }

  return response.data.data;
}

export type FollowListResponse = {
  status: boolean;
  data: UserSummary[];
};

export async function fetchFollowing(userId: number) {
  const response = await api.get<FollowListResponse>("/follow/following", {
    params: { user_id: userId }
  });

  if (!response.data.status) {
    throw new Error("Failed to load following");
  }

  return response.data.data;
}

export async function fetchFollowers(userId: number) {
  const response = await api.get<FollowListResponse>("/follow/follower", {
    params: { user_id: userId }
  });

  if (!response.data.status) {
    throw new Error("Failed to load followers");
  }

  return response.data.data;
}

export type RecommendFollowResponse = {
  status: boolean;
  data: Pick<UserSummary, "id" | "name" | "username" | "description" | "avatar_path">[];
};

export async function fetchRecommendFollow() {
  const response = await api.get<RecommendFollowResponse>(
    "/follow/getRecommendFollow"
  );

  if (!response.data.status) {
    throw new Error("Failed to load recommendations");
  }

  return response.data.data;
}
