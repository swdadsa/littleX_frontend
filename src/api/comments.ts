import api from "./client";

export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  user_name: string;
  user_username: string;
  user_avatar: string | null;
  comment: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
};

export type CommentsResponse = {
  status: boolean;
  data: Comment[];
};

export async function fetchComments(postId: number) {
  const response = await api.get<CommentsResponse>("/comment", {
    params: { post_id: postId }
  });

  if (!response.data.status) {
    throw new Error("Failed to load comments");
  }

  return response.data.data;
}

export type CommentLikeResponse = {
  status: boolean;
  data: string;
};

export async function toggleCommentLike(commentId: number) {
  const response = await api.post<CommentLikeResponse>("/comment/like", {
    comment_id: commentId
  });

  if (!response.data.status) {
    throw new Error("Failed to update comment like");
  }

  return response.data.data;
}

export type CreateCommentResponse = {
  status: boolean;
  data: string;
};

export async function createComment(postId: number, comment: string) {
  const response = await api.post<CreateCommentResponse>("/comment", {
    post_id: postId,
    comment
  });

  if (!response.data.status) {
    throw new Error("Failed to create comment");
  }

  return response.data.data;
}
