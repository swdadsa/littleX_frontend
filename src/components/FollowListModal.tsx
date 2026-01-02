import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFollowers, fetchFollowing, type UserSummary } from "../api/users";
import { getApiErrorMessage } from "../utils/apiError";

type FollowListModalProps = {
  userId: number;
  mode: "followers" | "following";
  onClose: () => void;
};

export default function FollowListModal({
  userId,
  mode,
  onClose
}: FollowListModalProps) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const load = mode === "followers" ? fetchFollowers : fetchFollowing;
    load(userId)
      .then((data) => {
        if (active) {
          setUsers(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(getApiErrorMessage(err));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [mode, userId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
        onClick={(event) => event.stopPropagation()}
        role="presentation"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            {mode === "followers" ? "Followers" : "Following"}
          </h3>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <span aria-hidden="true">x</span>
          </button>
        </div>
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
            Loading...
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        {!loading && !error && users.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
            No users found.
          </div>
        ) : null}
        <div className="mt-3 flex flex-col gap-3">
          {users.map((user) => (
            <button
              key={user.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50"
              type="button"
              onClick={() => {
                onClose();
                navigate(`/profile/${user.username}`);
              }}
            >
              {user.avatar_path ? (
                <img
                  src={user.avatar_path}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
              )}
              <div>
                <strong className="block text-sm text-slate-900">
                  {user.name}
                </strong>
                <span className="text-xs text-slate-500">
                  @{user.username}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
