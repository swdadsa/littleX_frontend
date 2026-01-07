import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchFollowingPosts,
  togglePostLike,
  type FollowingPost
} from "../api/posts";
import { followUser, unfollowUser } from "../api/users";
import Comments from "../components/Comments";
import PostComposerModal from "../components/PostComposerModal";
import PostImageCarousel from "../components/PostImageCarousel";
import { useCreatePost } from "../hooks/useCreatePost";
import { getApiErrorMessage } from "../utils/apiError";
import { formatRelativeTime } from "../utils/time";
import { getUser } from "../utils/user";

const prompts = [
  "Ask a question to your followers",
  "Share a quick win from today",
  "Post a link with context"
];

export default function Explore() {
  const [posts, setPosts] = useState<FollowingPost[]>([]);
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const likeSnapshot = useRef<FollowingPost[] | null>(null);
  const [likeLoadingId, setLikeLoadingId] = useState<number | null>(null);
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [followLoadingId, setFollowLoadingId] = useState<number | null>(null);
  const user = useMemo(() => getUser(), []);
  const [composerOpen, setComposerOpen] = useState(false);

  const loadPage = useCallback(
    async (nextPage: number) => {
      if (loading) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFollowingPosts(nextPage);
        setPosts((prev) =>
          nextPage === 1 ? data.posts : [...prev, ...data.posts]
        );
        setPage(data.current_page);
        setLastPage(data.last_page);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  const toggleLike = useCallback(async (postId: number) => {
    setLikeLoadingId(postId);
    setError(null);
    setPosts((prev) => {
      likeSnapshot.current = prev;
      return prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              youalreadyliked: !post.youalreadyliked,
              likes_count: post.youalreadyliked
                ? post.likes_count - 1
                : post.likes_count + 1
            }
          : post
      );
    });

    try {
      await togglePostLike(postId);
    } catch (err) {
      if (likeSnapshot.current) {
        setPosts(likeSnapshot.current);
      }
      setError(getApiErrorMessage(err));
    } finally {
      setLikeLoadingId(null);
    }
  }, []);

  const toggleFollow = useCallback(async (userId: number, followed: boolean) => {
    setFollowLoadingId(userId);
    setError(null);
    try {
      if (followed) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      setPosts((prev) =>
        prev.map((post) =>
          post.user_id === userId
            ? { ...post, youalreadyfollowed: !followed }
            : post
        )
      );
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setFollowLoadingId(null);
    }
  }, []);

  const { submit, loading: creating, error: createError } = useCreatePost(() => {
    loadPage(1);
    setComposerOpen(false);
  });

  useEffect(() => {
    if (page === 0) {
      loadPage(1);
    }
  }, [page, loadPage]);

  useEffect(() => {
    if (!sentinelRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < lastPage) {
          loadPage(page + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, page, lastPage, loadPage]);

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Start a post</h3>
          <button className="rounded-full px-3 py-2 text-sm text-slate-500 transition hover:text-slate-900">
            Schedule
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-start">
          {user?.avatar_path ? (
            <img
              src={user.avatar_path}
              alt={user.name}
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
          )}
          <div>
            <input
              className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none"
              placeholder="What is on your mind?"
              onFocus={() => setComposerOpen(true)}
            />
            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
          <button
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600"
            type="button"
            onClick={() => setComposerOpen(true)}
          >
            Post
          </button>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="group relative">
                  <button
                    className="flex items-center"
                    type="button"
                    onClick={() => {
                      window.location.href = `/profile/${post.username}`;
                    }}
                  >
                    {post.avatar_path ? (
                      <img
                        src={post.avatar_path}
                        alt={post.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                    )}
                  </button>
                  <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-56 translate-y-2 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center gap-3">
                      {post.avatar_path ? (
                        <img
                          src={post.avatar_path}
                          alt={post.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                      )}
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {post.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          @{post.username}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {post.description ?? ""}
                    </p>
                  </div>
                </div>
                <div>
                  <strong className="block text-sm text-slate-900">
                    {post.name}
                  </strong>
                  <small className="text-xs text-slate-500">
                    @{post.username} - {formatRelativeTime(post.created_at)}
                  </small>
                </div>
              </div>
              <button
                className="rounded-full px-3 py-1 text-sm text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                type="button"
                disabled={followLoadingId === post.user_id}
                onClick={() => toggleFollow(post.user_id, post.youalreadyfollowed)}
              >
                {post.youalreadyfollowed ? "Following" : "Follow"}
              </button>
            </div>
            <p className="text-sm text-slate-600">{post.body}</p>
            {post.hashtag && post.hashtag.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {post.hashtag.map((tag) => (
                  <span
                    key={`${post.id}-${tag.id}`}
                    className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                  >
                    #{tag.hashtag}
                  </span>
                ))}
              </div>
            ) : null}
            <PostImageCarousel images={post.image ?? []} />
            <div className="flex flex-wrap gap-2 text-sm text-slate-500">
              <button
                className={[
                  "rounded-full px-3 py-1 text-xs font-semibold transition",
                  post.youalreadyliked
                    ? "bg-rose-100 text-rose-700"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900"
                ].join(" ")}
                onClick={() => toggleLike(post.id)}
                disabled={likeLoadingId === post.id}
                type="button"
              >
                {post.youalreadyliked ? "Unlike" : "Like"} {post.likes_count}
              </button>
              <button
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:text-slate-900"
                type="button"
                onClick={() =>
                  setOpenComments((prev) => ({
                    ...prev,
                    [post.id]: !prev[post.id]
                  }))
                }
              >
                {post.comments_count} comments
              </button>
            </div>
            <Comments postId={post.id} open={!!openComments[post.id]} />
          </article>
        ))}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Loading posts...
          </div>
        ) : null}
        {!loading && posts.length === 0 && !error ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No posts yet.
          </div>
        ) : null}
        <div ref={sentinelRef} />
      </section>
      <PostComposerModal
        open={composerOpen}
        loading={creating}
        error={createError}
        onClose={() => setComposerOpen(false)}
        onSubmit={submit}
      />
      <button
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-2xl text-white shadow-lg transition hover:bg-slate-800"
        type="button"
        onClick={() => setComposerOpen(true)}
        aria-label="New post"
      >
        +
      </button>
    </div>
  );
}
