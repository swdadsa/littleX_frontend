import api from "./client";

export type Post = {
  id: number;
  user_id: number;
  body: string;
  likes_count: number;
  comments_count: number;
  youalreadyliked: boolean;
  created_at: string;
};

export type PostsResponse = {
  status: boolean;
  data: Post[];
};

function normalizePost(post: Post) {
  return {
    ...post,
    youalreadyliked:
      post.youalreadyliked === true ||
      post.youalreadyliked === 1 ||
      post.youalreadyliked === "true"
  };
}

export async function fetchPosts(userId?: number) {
  const response = userId
    ? await api.get<PostsResponse>("/posts/getAllPostsByUserId", {
        params: { user_id: userId }
      })
    : await api.get<PostsResponse>("/posts");

  if (!response.data.status) {
    throw new Error("Failed to load posts");
  }

  return response.data.data.map(normalizePost);
}

export type LikeResponse = {
  status: boolean;
  data: string;
};

export async function togglePostLike(postId: number) {
  const response = await api.post<LikeResponse>("/like", {
    post_id: postId
  });

  if (!response.data.status) {
    throw new Error("Failed to update like");
  }

  return response.data.data;
}
