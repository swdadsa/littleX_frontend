import api from "./client";

export type NotificationUser = {
  id: number;
  name: string;
  username: string;
  avatar_path: string | null;
};

export type NotificationData = {
  type: string;
  user_id: number;
  post_id?: number;
  comment_id?: number;
  message: string;
};

export type NotificationItem = {
  id: string;
  type: string;
  read_at: string | null;
  created_at: string;
  data: NotificationData;
  user: NotificationUser;
};

export type NotificationListResponse = {
  status: boolean;
  data: NotificationItem[];
};

export type NotificationCountResponse = {
  status: boolean;
  data: number;
};

export async function fetchNotificationCount() {
  const response = await api.get<NotificationCountResponse>(
    "/notification/count"
  );

  if (!response.data.status) {
    throw new Error("Failed to load notification count");
  }

  return response.data.data;
}

export async function fetchNotifications() {
  const response = await api.get<NotificationListResponse>("/notification");

  if (!response.data.status) {
    throw new Error("Failed to load notifications");
  }

  return response.data.data;
}
