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
  hashtag: {
    id: number;
    order: number;
    post_id: number;
    hashtag: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }[];
  share:
    | {
        post_id: number;
        user_id: number;
        body: string;
        created_at: string;
        user: {
          id: number;
          name: string;
          username: string;
          description: string | null;
          avatar: string | null;
        };
        images: {
          id: number;
          order: number;
          image_path: string;
        }[];
        hashtag: {
          id: number;
          post_id: number;
          order: number;
          hashtag: string;
        }[];
      }
    | []
    | null;
  youalreadyliked: boolean;
  created_at: string;
};

export type PostDetail = {
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
  hashtag: {
    id: number;
    post_id: number;
    order: number;
    hashtag: string;
  }[];
  created_at: string;
  user: {
    id: number;
    name: string;
    username: string;
    description: string | null;
    avatar: string | null;
  };
  youalreadyliked?: boolean;
};

export type PostDetailResponse = {
  status: boolean;
  data: PostDetail;
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

export async function fetchPostById(postId: number) {
  const response = await api.get<PostDetailResponse>(`/posts/${postId}`);

  if (!response.data.status) {
    throw new Error("Failed to load post");
  }

  return response.data.data;
}

export type CreatePostResponse = {
  status: boolean;
  data: Post;
};

export type DeletePostResponse = {
  status: boolean;
  data: string;
};

export async function createPost(
  body: string,
  images?: File[],
  hashtags?: string[]
) {
  const form = new FormData();
  form.append("body", body);
  (images ?? []).slice(0, 15).forEach((file, index) => {
    form.append(`image[${index}]`, file);
  });
  (hashtags ?? []).slice(0, 5).forEach((tag, index) => {
    form.append(`hashtag[${index}]`, tag);
  });

  const response = await api.post<CreatePostResponse>("/posts", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  if (!response.data.status) {
    throw new Error("Failed to create post");
  }

  return response.data.data;
}

export async function deletePost(postId: number) {
  const response = await api.delete<DeletePostResponse>(`/posts/${postId}`);

  if (!response.data.status) {
    throw new Error(response.data.data || "Failed to delete post");
  }

  return response.data.data;
}

export type TrendingHashtag = {
  hashtag: string;
  count: number;
};

export type TrendingHashtagResponse = {
  status: boolean;
  data: TrendingHashtag[];
};

export async function fetchTrendingHashtags() {
  const response = await api.get<TrendingHashtagResponse>("/posts/weekHashtag");

  if (!response.data.status) {
    throw new Error("Failed to load trending hashtags");
  }

  return response.data.data;
}

export type FollowingPost = {
  id: number;
  user_id: number;
  name: string;
  username: string;
  description: string | null;
  avatar_path: string | null;
  body: string;
  likes_count: number;
  comments_count: number;
  youalreadyliked: boolean;
  youalreadyfollowed: boolean;
  hashtag: {
    id: number;
    order: number;
    post_id: number;
    hashtag: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }[];
  image: {
    id: number;
    order: number;
    image_path: string;
  }[];
  created_at: string;
};

export type FollowingPostResponse = {
  status: boolean;
  data: {
    posts: FollowingPost[];
    current_page: number;
    last_page: number;
  };
};

export async function fetchFollowingPosts(page: number) {
  const response = await api.get<FollowingPostResponse>(
    "/posts/getFollowingUserPost",
    { params: { page } }
  );

  if (!response.data.status) {
    throw new Error("Failed to load following posts");
  }

  const payload = response.data.data;
  const safePosts = Array.isArray(payload.posts) ? payload.posts : [];

  return {
    ...payload,
    posts: safePosts
  };
}

export async function fetchRandomPosts(page: number) {
  const response = await api.get<FollowingPostResponse>("/posts/getRandomPost", {
    params: { page }
  });

  if (!response.data.status) {
    throw new Error("Failed to load random posts");
  }

  const payload = response.data.data;
  const safePosts = Array.isArray(payload.posts) ? payload.posts : [];

  return {
    ...payload,
    posts: safePosts
  };
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
