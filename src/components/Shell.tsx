import { NavLink, Outlet } from "react-router-dom";

const trending = [
  { tag: "#DesignOps", posts: "2,140 posts" },
  { tag: "#ViteStack", posts: "980 posts" },
  { tag: "#LittleX", posts: "740 posts" },
  { tag: "#FrontRow", posts: "412 posts" }
];

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
  return (
    <div className="min-h-screen">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 py-6 md:px-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_280px]">
        <aside className="flex flex-col items-start gap-4 lg:sticky lg:top-6">
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
          <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
            <h4 className="mb-2 text-base font-semibold">Post something</h4>
            <p className="mb-4 text-sm text-slate-500">
              Draft a short update to share with your circle.
            </p>
            <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600">
              Compose
            </button>
          </div>
        </aside>
        <main className="flex flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <input
                className="w-full min-w-[220px] rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none"
                placeholder="Search posts, people"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full px-3 py-2 text-sm text-slate-500 transition hover:text-slate-900">
                Notifications
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
            </div>
          </header>
          <Outlet />
        </main>
        <aside className="hidden flex-col gap-5 xl:flex xl:sticky xl:top-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-semibold">Trending</h3>
            <div className="flex flex-col gap-4">
              {trending.map((item) => (
                <div
                  key={item.tag}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm font-medium text-slate-800">
                    {item.tag}
                  </span>
                  <small className="text-xs text-slate-500">{item.posts}</small>
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
