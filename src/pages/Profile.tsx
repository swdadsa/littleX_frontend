const posts = [
  {
    id: "p1",
    title: "Quiet launch, big momentum",
    body: "Our new dashboard is live for early partners. Feedback so far feels sharp.",
    time: "2h ago",
    likes: 128,
    comments: 24
  },
  {
    id: "p2",
    title: "Design jam recap",
    body: "Spent the afternoon exploring calmer color systems. Gradient studies ready.",
    time: "1d ago",
    likes: 94,
    comments: 15
  },
  {
    id: "p3",
    title: "Signal over noise",
    body: "Keeping the feed tight and relevant with new filters and spaces.",
    time: "3d ago",
    likes: 62,
    comments: 8
  }
];

export default function Profile() {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <div className="h-36 rounded-3xl bg-gradient-to-br from-amber-200 via-orange-300 to-rose-400" />
        <div className="-mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-[72px] w-[72px] rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Riley Hart
              </h2>
              <p className="text-sm text-slate-500">@riley.h</p>
            </div>
          </div>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
            Edit profile
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <strong className="block text-sm font-semibold text-slate-900">
              Designer
            </strong>
            <span className="text-sm text-slate-500">LittleX Studio</span>
          </div>
          <div>
            <strong className="block text-sm font-semibold text-slate-900">
              Chicago
            </strong>
            <span className="text-sm text-slate-500">GMT-5</span>
          </div>
          <div>
            <strong className="block text-sm font-semibold text-slate-900">
              Joined
            </strong>
            <span className="text-sm text-slate-500">2022</span>
          </div>
        </div>
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-semibold text-slate-900">
            Your stats
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <strong className="block text-2xl text-slate-900">312</strong>
              <span className="text-sm text-slate-500">posts</span>
            </div>
            <div>
              <strong className="block text-2xl text-slate-900">4.8k</strong>
              <span className="text-sm text-slate-500">followers</span>
            </div>
            <div>
              <strong className="block text-2xl text-slate-900">620</strong>
              <span className="text-sm text-slate-500">following</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Keep the tone consistent. Your most saved posts are short, clear, and
            optimistic.
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
          <button className="rounded-full px-3 py-2 text-sm text-slate-500 transition hover:text-slate-900">
            Filter
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <h4 className="text-base font-semibold text-slate-900">
                  {post.title}
                </h4>
                <p className="mt-2 text-sm text-slate-600">{post.body}</p>
                <small className="text-xs text-slate-500">{post.time}</small>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
