import { FormEvent, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTrendingHashtags } from "../hooks/useTrendingHashtags";
import { useUserSearch } from "../hooks/useUserSearch";

const suggestions = [
  { name: "Alex M", role: "Product" },
  { name: "Nova Liu", role: "Engineer" },
  { name: "Cam Reed", role: "Writer" }
];

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
  const { results, loading } = useUserSearch(query);
  const {
    hashtags: trending,
    loading: trendingLoading,
    error: trendingError
  } = useTrendingHashtags();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    navigate(`/search?query=${encodeURIComponent(trimmed)}`);
    setFocused(false);
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
            <NavLink className={linkClass} to="/login">
              Sign out
            </NavLink>
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
                  {results.map((user) => (
                    <button
                      key={user.id}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                      type="button"
                      onMouseDown={() => {
                        navigate(`/profile/${user.username}`);
                        setFocused(false);
                      }}
                    >
                      {user.avatar_path ? (
                        <img
                          src={user.avatar_path}
                          alt={user.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
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
              ) : null}
            </form>
            <div className="flex items-center gap-3">
              <button className="rounded-full px-3 py-2 text-sm text-slate-500 transition hover:text-slate-900">
                Notifications
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
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
              {suggestions.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                  <div className="flex-1">
                    <strong className="block text-sm">{item.name}</strong>
                    <small className="text-xs text-slate-500">
                      {item.role}
                    </small>
                  </div>
                  <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}