import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import type { User } from "../api/auth";
import {
  fetchUserById,
  fetchUserByUsername,
  followUser,
  type UserSummary,
  unfollowUser
} from "../api/users";
import Comments from "../components/Comments";
import EditProfileModal from "../components/EditProfileModal";
import FollowListModal from "../components/FollowListModal";
import ImagePreviewModal from "../components/ImagePreviewModal";
import PostComposerModal from "../components/PostComposerModal";
import PostImageCarousel from "../components/PostImageCarousel";
import Toast from "../components/Toast";
import { useCreatePost } from "../hooks/useCreatePost";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { usePosts } from "../hooks/usePosts";
import { getApiErrorMessage } from "../utils/apiError";
import { formatRelativeTime } from "../utils/time";
import { getUser, setUser } from "../utils/user";

export default function Profile() {
  const { username } = useParams();
  const [user, setUserState] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<UserSummary | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [followModal, setFollowModal] = useState<
    "followers" | "following" | null
  >(null);
  const [editOpen, setEditOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const currentUser = useMemo(() => getUser(), []);
  const isSelf =
    !username ||
    (currentUser?.username &&
      currentUser.username.toLowerCase() === username.toLowerCase());
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [composerOpen, setComposerOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<number | undefined>(
    currentUser?.id
  );
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const {
    posts,
    loading,
    error,
    toggleLike,
    likeLoadingId,
    reload,
    removePost,
    deletingId
  } = usePosts(true, activeUserId);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { submit, loading: creating, error: createError } = useCreatePost(() => {
    reload();
    setComposerOpen(false);
    setToast({ message: "Post created.", type: "success" });
  });
  const {
    submit: submitProfile,
    loading: updating,
    error: updateError
  } = useUpdateProfile(async () => {
    if (!activeUserId) {
      return;
    }
    const fresh = await fetchUserById(activeUserId);
    if (fresh) {
      setViewUser(fresh);
      const localUser = getUser();
      if (localUser && localUser.id === fresh.id) {
        setUser({
          ...localUser,
          name: fresh.name,
          username: fresh.username,
          description: fresh.description ?? null,
          avatar_path: fresh.avatar_path ?? null,
          cover_path: "cover_path" in fresh ? fresh.cover_path ?? null : null,
          follower_count: fresh.follower_count,
          following_count: fresh.following_count,
          posts_count: fresh.posts_count
        });
      }
    }
    setEditOpen(false);
    setToast({ message: "Profile updated.", type: "success" });
  });

  useEffect(() => {
    setUserState(getUser());
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const handle = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(handle);
  }, [toast]);

  useEffect(() => {
    let active = true;
    setProfileError(null);

    if (!username || isSelf) {
      setViewUser(null);
      setActiveUserId(currentUser?.id);
      return;
    }

    fetchUserByUsername(username)
      .then((data) => {
        if (!active) {
          return;
        }
        if (!data) {
          setProfileError("User not found.");
          setViewUser(null);
          setActiveUserId(undefined);
          return;
        }
        setViewUser(data);
        setActiveUserId(data.id);
      })
      .catch((err) => {
        if (active) {
          setProfileError(
            err instanceof Error ? err.message : "Failed to load profile."
          );
          setActiveUserId(undefined);
        }
      });

    return () => {
      active = false;
    };
  }, [username, isSelf, currentUser?.id]);

  useEffect(() => {
    let active = true;

    if (!activeUserId) {
      return undefined;
    }

    fetchUserById(activeUserId)
      .then((data) => {
        if (active && data) {
          setViewUser(data);
        }
      })
      .catch((err) => {
        if (active) {
          setProfileError(
            err instanceof Error ? err.message : "Failed to load profile."
          );
        }
      });

    return () => {
      active = false;
    };
  }, [activeUserId]);

  useEffect(() => {
    if (createError) {
      setToast({ message: createError, type: "error" });
    }
  }, [createError]);

  useEffect(() => {
    if (updateError) {
      setToast({ message: updateError, type: "error" });
    }
  }, [updateError]);

  useEffect(() => {
    if (error) {
      setToast({ message: error, type: "error" });
    }
  }, [error]);

  const profileUser = viewUser ?? user;
  const canFollow = profileUser ? profileUser.is_myself === false : false;

  const handleCreatePost = async (
    body: string,
    images?: File[],
    hashtags?: string[]
  ) => {
    try {
      await submit(body, images, hashtags);
    } catch (err) {
      setToast({ message: getApiErrorMessage(err), type: "error" });
      throw err;
    }
  };

  const handleUpdateProfile = async (payload: Parameters<typeof submitProfile>[1]) => {
    if (!activeUserId) {
      return Promise.resolve();
    }
    try {
      await submitProfile(activeUserId, payload);
    } catch (err) {
      setToast({ message: getApiErrorMessage(err), type: "error" });
      throw err;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <section className="flex flex-col gap-4">
          <div className="h-36 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-200 via-orange-300 to-rose-400">
            {profileUser &&
            "cover_path" in profileUser &&
            profileUser.cover_path ? (
              <button
                className="h-full w-full"
                type="button"
                onClick={() => setPreviewSrc(profileUser.cover_path ?? null)}
              >
                <img
                  src={profileUser.cover_path}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
              </button>
            ) : null}
          </div>
          <div className="-mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-1 items-center gap-4">
              {profileUser?.avatar_path ? (
                <button
                  type="button"
                  onClick={() => setPreviewSrc(profileUser.avatar_path ?? null)}
                  className="h-[72px] w-[72px]"
                >
                  <img
                    src={profileUser.avatar_path}
                    alt={profileUser.name}
                    className="h-[72px] w-[72px] rounded-full object-cover"
                  />
                </button>
              ) : (
                <div className="h-[72px] w-[72px] rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900">
                  {profileUser?.name ?? "Riley Hart"}
                </h2>
                <p className="text-sm text-slate-500">
                  @{profileUser?.username ?? "riley.h"}
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl p-1">
                    <strong className="block text-2xl text-slate-900">
                      {profileUser?.posts_count ?? 0}
                    </strong>
                    <span className="text-sm text-slate-500">posts</span>
                  </div>
                  <div>
                    <button
                      className="rounded-xl p-1 text-left transition hover:bg-slate-100"
                      type="button"
                      onClick={() => setFollowModal("followers")}
                    >
                      <strong className="block text-2xl text-slate-900">
                        {profileUser?.follower_count ?? 0}
                      </strong>
                      <span className="text-sm text-slate-500">followers</span>
                    </button>
                  </div>
                  <div>
                    <button
                      className="rounded-xl p-1 text-left transition hover:bg-slate-100"
                      type="button"
                      onClick={() => setFollowModal("following")}
                    >
                      <strong className="block text-2xl text-slate-900">
                        {profileUser?.following_count ?? 0}
                      </strong>
                      <span className="text-sm text-slate-500">following</span>
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  {profileUser?.description ?? ""}
                </p>
              </div>
            </div>
            {canFollow ? (
              <button
                className={[
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  profileUser?.is_follow
                    ? "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                ].join(" ")}
                onClick={async () => {
                  if (!profileUser) {
                    return;
                  }
                  setFollowLoading(true);
                  try {
                    if (profileUser.is_follow) {
                      await unfollowUser(profileUser.id);
                      setViewUser({ ...profileUser, is_follow: false });
                      setToast({ message: "Unfollowed user.", type: "success" });
                    } else {
                      await followUser(profileUser.id);
                      setViewUser({ ...profileUser, is_follow: true });
                      setToast({ message: "Followed user.", type: "success" });
                    }
                  } catch (err) {
                    setToast({ message: getApiErrorMessage(err), type: "error" });
                  } finally {
                    setFollowLoading(false);
                  }
                }}
                disabled={followLoading}
                type="button"
              >
                {profileUser?.is_follow ? "Following" : "Follow"}
              </button>
            ) : (
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                type="button"
                onClick={() => setEditOpen(true)}
              >
                Edit profile
              </button>
            )}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Your posts</h3>
            <div className="flex items-center gap-2">
              <button
                className="rounded-full px-3 py-2 text-sm text-slate-500 transition hover:text-slate-900"
                type="button"
              >
                Filter
              </button>
              <button
                className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                type="button"
                onClick={() => setComposerOpen(true)}
              >
                New post
              </button>
            </div>
          </div>
          {profileError ? (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {profileError}
            </div>
          ) : null}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                Loading posts...
              </div>
            ) : null}
            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
            {!loading && !error && posts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                No posts yet.
              </div>
            ) : null}
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {profileUser?.avatar_path ? (
                        <img
                          src={profileUser.avatar_path}
                          alt={profileUser.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="block text-sm text-slate-900">
                            {profileUser?.name ?? "Riley Hart"}
                          </strong>
                          <span className="text-[11px] text-slate-400">
                            {formatRelativeTime(post.created_at)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          @{profileUser?.username ?? "riley.h"}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <button
                        className="rounded-full px-2 py-1 text-lg text-slate-500 transition hover:text-slate-900"
                        type="button"
                        onClick={() =>
                          setMenuOpen((prev) =>
                            prev === post.id ? null : post.id
                          )
                        }
                        aria-label="Post actions"
                      >
                        ...
                      </button>
                      {menuOpen === post.id ? (
                        <div className="absolute right-0 z-10 mt-2 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                          <button
                            className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                            type="button"
                            onClick={() => {
                              setMenuOpen(null);
                              setConfirmDeleteId(post.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </div>
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
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
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
          </div>
        </section>
      </div>
      {followModal && profileUser ? (
        <FollowListModal
          userId={profileUser.id}
          mode={followModal}
          onClose={() => setFollowModal(null)}
        />
      ) : null}
      {confirmDeleteId ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => {
            setConfirmDeleteId(null);
            setDeleteError(null);
          }}
          role="presentation"
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
            onClick={(event) => event.stopPropagation()}
            role="presentation"
          >
            <h3 className="text-base font-semibold text-slate-900">
              Delete post?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              This action cannot be undone.
            </p>
            {deleteError ? (
              <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {deleteError}
              </div>
            ) : null}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:text-slate-900"
                type="button"
                onClick={() => {
                  setConfirmDeleteId(null);
                  setDeleteError(null);
                }}
              >
                Cancel
              </button>
              <button
                className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                type="button"
                disabled={deletingId === confirmDeleteId}
                onClick={async () => {
                  if (!confirmDeleteId) {
                    return;
                  }
                  try {
                    await removePost(confirmDeleteId);
                    setConfirmDeleteId(null);
                    setToast({ message: "Post deleted.", type: "success" });
                  } catch (err) {
                    setDeleteError(
                      err instanceof Error
                        ? err.message
                        : "Failed to delete post."
                    );
                    setToast({ message: getApiErrorMessage(err), type: "error" });
                  }
                }}
              >
                {deletingId === confirmDeleteId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <EditProfileModal
        open={editOpen}
        user={profileUser}
        loading={updating}
        error={updateError}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdateProfile}
      />
      <PostComposerModal
        open={composerOpen}
        loading={creating}
        error={createError}
        onClose={() => setComposerOpen(false)}
        onSubmit={handleCreatePost}
      />
      <ImagePreviewModal
        src={previewSrc}
        open={!!previewSrc}
        onClose={() => setPreviewSrc(null)}
      />
      <button
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-2xl text-white shadow-lg transition hover:bg-slate-800"
        type="button"
        onClick={() => setComposerOpen(true)}
        aria-label="New post"
      >
        +
      </button>
      {toast ? (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
          <Toast message={toast.message} type={toast.type} />
        </div>
      ) : null}
    </>
  );
}
