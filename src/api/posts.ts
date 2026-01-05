import api from "./client";

export type Post = {
  id: number;
  user_id: number;
  body: string;
  likes_count: number;
  comments_count: number;
  image: {
    id: number;
    order: number;
    image_path: string;
  }[];
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

export type CreatePostResponse = {
  status: boolean;
  data: Post;
};

export async function createPost(body: string, images?: File[]) {
  const form = new FormData();
  form.append("body", body);
  (images ?? []).slice(0, 15).forEach((file, index) => {
    form.append(`image[${index}]`, file);
  });

  const response = await api.post<CreatePostResponse>("/posts", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  if (!response.data.status) {
    throw new Error("Failed to create post");
  }

  return response.data.data;
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
