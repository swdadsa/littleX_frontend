import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchPostById, sharePost, togglePostLike, type PostDetail } from "../api/posts";
import Comments from "../components/Comments";
import PostImageCarousel from "../components/PostImageCarousel";
import SharePostModal from "../components/SharePostModal";
import Toast from "../components/Toast";
import { getApiErrorMessage } from "../utils/apiError";
import { formatRelativeTime } from "../utils/time";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [openComments, setOpenComments] = useState(true);
  const highlightCommentId =
    (location.state as { highlightCommentId?: number } | null)
      ?.highlightCommentId ?? null;
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const canLike = useMemo(
    () => typeof post?.youalreadyliked === "boolean",
    [post]
  );
  const hashtags = useMemo(() => {
    if (!post?.hashtag) {
      return [];
    }
    return Array.isArray(post.hashtag) ? post.hashtag : [post.hashtag];
  }, [post]);

  useEffect(() => {
    if (!postId) {
      return;
    }
    const parsed = Number(postId);
    if (Number.isNaN(parsed)) {
      setError("Invalid post id.");
      return;
    }
    setLoading(true);
    setError(null);
    fetchPostById(parsed)
      .then((data) => setPost(data))
      .catch((err) => setError(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [postId]);

  useEffect(() => {
    if (highlightCommentId) {
      setOpenComments(true);
    }
  }, [highlightCommentId]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const handle = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(handle);
  }, [toast]);

  const handleLike = async () => {
    if (!post || !canLike || likeLoading) {
      return;
    }
    setLikeLoading(true);
    const prev = post;
    setPost({
      ...post,
      youalreadyliked: !post.youalreadyliked,
      likes_count: post.youalreadyliked
        ? post.likes_count - 1
        : post.likes_count + 1
    });
    try {
      await togglePostLike(post.id);
    } catch (err) {
      setPost(prev);
      setError(getApiErrorMessage(err));
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Post</h2>
          <button
            className="rounded-full px-3 py-1 text-sm text-slate-500 transition hover:text-slate-900"
            type="button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
        {loading ? (
          <div className="text-sm text-slate-500">Loading post...</div>
        ) : null}
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        {post ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <button
                className="group relative"
                type="button"
                onClick={() => navigate(`/profile/${post.user.username}`)}
              >
                {post.user.avatar ? (
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                )}
                <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-56 translate-y-2 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex items-center gap-3">
                    {post.user.avatar ? (
                      <img
                        src={post.user.avatar}
                        alt={post.user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                    )}
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {post.user.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        @{post.user.username}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {post.user.description ?? ""}
                  </p>
                </div>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <strong className="text-sm text-slate-900">
                    {post.user.name}
                  </strong>
                  <span className="text-[11px] text-slate-400">
                    {formatRelativeTime(post.created_at)}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  @{post.user.username}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-600">{post.body}</p>
            {hashtags.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <span
                    key={`${post.id}-${tag.id}`}
                    className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                  >
                    #{tag.hashtag}
                  </span>
                ))}
              </div>
            ) : null}
            {post.share && !Array.isArray(post.share) ? (
              <button
                className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-slate-300"
                type="button"
                onClick={() => navigate(`/post/${post.share.post_id}`)}
              >
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Shared post
                </div>
                <div className="flex items-center gap-3">
                  <div className="group relative">
                    {post.share.user.avatar ? (
                      <img
                        src={post.share.user.avatar}
                        alt={post.share.user.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                    )}
                    <div className="pointer-events-none absolute left-0 top-full z-20 mt-2 w-56 translate-y-2 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex items-center gap-3">
                        {post.share.user.avatar ? (
                          <img
                            src={post.share.user.avatar}
                            alt={post.share.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                        )}
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {post.share.user.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            @{post.share.user.username}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {post.share.user.description ?? ""}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-slate-900">
                        {post.share.user.name}
                      </strong>
                      <span className="text-[11px] text-slate-400">
                        {formatRelativeTime(post.share.created_at)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      @{post.share.user.username}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {post.share.body}
                </p>
                {post.share.hashtag && post.share.hashtag.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.share.hashtag.map((tag) => (
                      <span
                        key={`${post.id}-share-${tag.id}`}
                        className="rounded-full bg-white px-2 py-1 text-xs text-slate-600"
                      >
                        #{tag.hashtag}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-3">
                  <PostImageCarousel images={post.share.images ?? []} />
                </div>
              </button>
            ) : null}
            <PostImageCarousel images={post.image ?? []} />
            <div className="flex flex-wrap gap-2 text-sm text-slate-500">
              {canLike ? (
                <button
                  className={[
                    "rounded-full px-3 py-1 text-xs font-semibold transition",
                    post.youalreadyliked
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900"
                  ].join(" ")}
                  onClick={handleLike}
                  disabled={likeLoading}
                  type="button"
                >
                  {post.youalreadyliked ? "Unlike" : "Like"} {post.likes_count}
                </button>
              ) : (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Likes {post.likes_count}
                </span>
              )}
              <button
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:text-slate-900"
                type="button"
                onClick={() => setOpenComments((prev) => !prev)}
              >
                {post.comments_count} comments
              </button>
              {!post.share || Array.isArray(post.share) ? (
                <button
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:text-slate-900"
                  type="button"
                  onClick={() => {
                    setShareOpen(true);
                    setShareError(null);
                  }}
                >
                  Share
                </button>
              ) : null}
            </div>
            <Comments
              postId={post.id}
              open={openComments}
              highlightCommentId={highlightCommentId}
            />
          </div>
        ) : null}
      </section>
      <SharePostModal
        open={shareOpen}
        loading={shareLoading}
        error={shareError}
        onClose={() => {
          setShareOpen(false);
          setShareError(null);
        }}
        onSubmit={async (body) => {
          if (!post) {
            return;
          }
          setShareLoading(true);
          setShareError(null);
          try {
            await sharePost(post.id, body);
            setShareOpen(false);
            setToast({ message: "Shared post.", type: "success" });
          } catch (err) {
            const message = getApiErrorMessage(err);
            setShareError(message);
            setToast({ message: message, type: "error" });
          } finally {
            setShareLoading(false);
          }
        }}
      />
      {toast ? (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
          <Toast message={toast.message} type={toast.type} />
        </div>
      ) : null}
    </div>
  );
}
