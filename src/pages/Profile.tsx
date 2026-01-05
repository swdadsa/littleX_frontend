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
import PostComposerModal from "../components/PostComposerModal";
import { useCreatePost } from "../hooks/useCreatePost";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { usePosts } from "../hooks/usePosts";
import { formatRelativeTime } from "../utils/time";
import { getUser, setUser } from "../utils/user";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<UserSummary | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [followLoading, setFollowLoading] = useState(false);
  const [followModal, setFollowModal] = useState<
    "followers" | "following" | null
  >(null);
  const [editOpen, setEditOpen] = useState(false);
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
  const { posts, loading, error, toggleLike, likeLoadingId, reload } = usePosts(
    true,
    activeUserId
  );
  const { submit, loading: creating, error: createError } = useCreatePost(() => {
    reload();
    setComposerOpen(false);
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
  });

  useEffect(() => {
    setUser(getUser());
  }, []);

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

  const profileUser = viewUser ?? user;
  const canFollow = profileUser ? profileUser.is_myself === false : false;

  return (
    <>
      <div className="flex flex-col gap-5">
        <section className="flex flex-col gap-4">
          <div className="h-36 overflow-hidden rounded-3xl bg-gradient-to-br from-amber-200 via-orange-300 to-rose-400">
            {profileUser && "cover_path" in profileUser && profileUser.cover_path ? (
              <img
                src={profileUser.cover_path}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="-mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              {profileUser?.avatar_path ? (
                <img
                  src={profileUser.avatar_path}
                  alt={profileUser.name}
                  className="h-[72px] w-[72px] rounded-full object-cover"
                />
              ) : (
                <div className="h-[72px] w-[72px] rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
              )}
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {profileUser?.name ?? "Riley Hart"}
                </h2>
                <p className="text-sm text-slate-500">
                  @{profileUser?.username ?? "riley.h"}
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
                    } else {
                      await followUser(profileUser.id);
                      setViewUser({ ...profileUser, is_follow: true });
                    }
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
        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-slate-900">
              Your stats
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
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
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold text-slate-900">
              Recent highlights
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">Top post</span>
                <strong className="text-sm text-slate-900">
                  9.2k impressions
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">Most liked</span>
                <strong className="text-sm text-slate-900">
                  1.1k reactions
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">New followers</span>
                <strong className="text-sm text-slate-900">+142 this week</strong>
              </div>
            </div>
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
                  <div className="mb-3 flex items-center gap-3">
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
                  <p className="text-sm text-slate-600">{post.body}</p>
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
      <EditProfileModal
        open={editOpen}
        user={profileUser}
        loading={updating}
        error={updateError}
        onClose={() => setEditOpen(false)}
        onSubmit={(payload) => {
          if (!activeUserId) {
            return Promise.resolve();
          }
          return submitProfile(activeUserId, payload);
        }}
      />
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
    </>
  );
}
