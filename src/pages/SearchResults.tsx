import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchUsers, type UserSummary } from "../api/users";
import { getApiErrorMessage } from "../utils/apiError";

export default function SearchResults() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("query") ?? "";
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setUsers([]);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    searchUsers(trimmed)
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
  }, [query]);

  return (
    <div className="flex flex-col gap-4">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Search results</h2>
        <p className="text-sm text-slate-500">
          Showing users for “{query || "—"}”
        </p>
      </header>
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          Loading users...
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      {!loading && !error && users.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No users found.
        </div>
      ) : null}
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <button
            key={user.id}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:bg-slate-50"
            type="button"
            onClick={() => navigate(`/profile/${user.username}`)}
          >
            {user.avatar_path ? (
              <img
                src={user.avatar_path}
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
            )}
            <div>
              <strong className="block text-sm text-slate-900">
                {user.name}
              </strong>
              <span className="text-xs text-slate-500">@{user.username}</span>
              <div className="mt-2 flex gap-4 text-xs text-slate-500">
                <span>{user.posts_count} posts</span>
                <span>{user.follower_count} followers</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
