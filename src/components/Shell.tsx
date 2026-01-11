import { FormEvent, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { followUser } from "../api/users";
import { useRecommendFollow } from "../hooks/useRecommendFollow";
import { useTrendingHashtags } from "../hooks/useTrendingHashtags";
import { useUserSearch } from "../hooks/useUserSearch";
import { getApiErrorMessage } from "../utils/apiError";
import { getUser } from "../utils/user";
import Toast from "./Toast";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-xl px-3 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-white text-slate-900 shadow-sm"
      : "text-slate-600 hover:bg-white hover:text-slate-900"
  ].join(" ");

export default function Shell() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const user = useMemo(() => getUser(), []);
  const { results, loading } = useUserSearch(query);
  const {
    hashtags: trending,
    loading: trendingLoading,
    error: trendingError
  } = useTrendingHashtags();
  const {
    users: suggestions,
    loading: suggestionsLoading,
    error: suggestionsError
  } = useRecommendFollow();
  const [followingIds, setFollowingIds] = useState<number[]>([]);
  const [followLoadingId, setFollowLoadingId] = useState<number | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    setFocused(false);
  };

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const handle = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(handle);
  }, [toast]);

  const handleLogout = async () => {
    if (logoutLoading) {
      return;
    }
    setLogoutLoading(true);
    try {
      await logout();
      setToast({ message: "\u767b\u51fa\u6210\u529f", type: "success" });
      window.setTimeout(() => navigate("/login"), 600);
    } catch (err) {
      setToast({ message: getApiErrorMessage(err), type: "error" });
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="mx-auto grid h-full max-w-6xl grid-cols-1 gap-6 px-5 py-6 md:px-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_280px]">
        <aside className="flex flex-col items-start gap-4 lg:sticky lg:top-0 lg:h-screen lg:py-6">
          <div className="text-3xl font-serif tracking-wide text-slate-900">
            LittleX
          </div>
          <nav className="flex flex-col gap-2">
            <NavLink className={linkClass} to="/explore">
              Explore
            </NavLink>
            <NavLink className={linkClass} to="/profile">
              Profile
            </NavLink>
            <button
              className={linkClass({ isActive: false })}
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? "Signing out..." : "Sign out"}
            </button>
          </nav>
        </aside>
        <main className="flex min-h-0 flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <form className="relative flex-1" onSubmit={handleSubmit}>
              <input
                className="w-full min-w-[220px] rounded-full border border-slate-200 bg-slate-50 px-4 py-2 pr-20 text-sm text-slate-700 focus:border-slate-300 focus:outline-none"
                placeholder="Search users by username"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800"
                type="submit"
              >
                Search
              </button>
              {focused && query.trim().length > 0 ? (
                <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                  {loading ? (
                    <div className="px-4 py-3 text-xs text-slate-500">
                      Searching...
                    </div>
                  ) : null}
                  {!loading && results.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-500">
                      No users found.
                    </div>
                  ) : null}
                  {results.map((userItem) => (
                    <button
                      key={userItem.id}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                      type="button"
                      onMouseDown={() => {
                        navigate(`/profile/${userItem.username}`);
                        setFocused(false);
                      }}
                    >
                      {userItem.avatar_path ? (
                        <img
                          src={userItem.avatar_path}
                          alt={userItem.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                      )}
                      <div>
                        <strong className="block text-sm text-slate-900">
                          {userItem.name}
                        </strong>
                        <span className="text-xs text-slate-500">
                          @{userItem.username}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : null}
            </form>
            <div className="flex items-center gap-3">
              {user?.avatar_path ? (
                <img
                  src={user.avatar_path}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
              )}
              <button className="rounded-full px-3 py-2 text-sm text-slate-500 transition hover:text-slate-900">
                Notifications
              </button>
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto pb-10">
            <Outlet />
          </div>
        </main>
        <aside className="hidden flex-col gap-5 xl:flex xl:sticky xl:top-0 xl:h-screen xl:py-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold">Trending</h3>
            <div className="flex flex-col gap-4">
              {trendingLoading ? (
                <div className="text-xs text-slate-500">Loading...</div>
              ) : null}
              {trendingError ? (
                <div className="text-xs text-rose-600">{trendingError}</div>
              ) : null}
              {!trendingLoading && !trendingError && trending.length === 0 ? (
                <div className="text-xs text-slate-500">No trends yet.</div>
              ) : null}
              {trending.map((item) => (
                <div
                  key={item.hashtag}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm font-medium text-slate-800">
                    #{item.hashtag}
                  </span>
                  <small className="text-xs text-slate-500">
                    {item.count}
                  </small>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold">Who to follow</h3>
            <div className="flex flex-col gap-4">
              {suggestionsLoading ? (
                <div className="text-xs text-slate-500">Loading...</div>
              ) : null}
              {suggestionsError ? (
                <div className="text-xs text-rose-600">{suggestionsError}</div>
              ) : null}
              {!suggestionsLoading && !suggestionsError && suggestions.length === 0 ? (
                <div className="text-xs text-slate-500">No suggestions yet.</div>
              ) : null}
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:bg-slate-50"
                  type="button"
                  onClick={() => navigate(`/profile/${item.username}`)}
                >
                  {item.avatar_path ? (
                    <img
                      src={item.avatar_path}
                      alt={item.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm">
                      {item.name}
                    </strong>
                    <small className="block truncate text-xs text-slate-500">
                      @{item.username}
                    </small>
                  </div>
                  <button
                    className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                    type="button"
                    disabled={
                      followLoadingId === item.id ||
                      followingIds.includes(item.id)
                    }
                    onClick={async (event) => {
                      event.stopPropagation();
                      setFollowLoadingId(item.id);
                      try {
                        await followUser(item.id);
                        setFollowingIds((prev) => [...prev, item.id]);
                      } catch (err) {
                        const message = getApiErrorMessage(err);
                        alert(message);
                      } finally {
                        setFollowLoadingId(null);
                      }
                    }}
                  >
                    {followingIds.includes(item.id) ? "Following" : "Follow"}
                  </button>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
      {toast ? (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
          <Toast message={toast.message} type={toast.type} />
        </div>
      ) : null}
    </div>
  );
}
