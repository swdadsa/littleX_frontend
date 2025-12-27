const feed = [
  {
    id: "e1",
    name: "Maya Cole",
    handle: "@mayac",
    time: "35m",
    title: "Prototype day",
    body: "Exploring a softer onboarding flow with a stacked progress meter.",
    likes: 54,
    comments: 12
  },
  {
    id: "e2",
    name: "Jordan Finch",
    handle: "@jfinch",
    time: "2h",
    title: "Field notes",
    body: "Testing the new feed algorithm with a smaller group of researchers.",
    likes: 88,
    comments: 21
  },
  {
    id: "e3",
    name: "Avery Sun",
    handle: "@avery",
    time: "6h",
    title: "Creative focus",
    body: "We trimmed the posting UI to keep writers in the flow longer.",
    likes: 34,
    comments: 5
  }
];

const prompts = [
  "Ask a question to your followers",
  "Share a quick win from today",
  "Post a link with context"
];

export default function Explore() {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            Start a post
          </h3>
          <button className="rounded-full px-3 py-2 text-sm text-slate-500 transition hover:text-slate-900">
            Schedule
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-start">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
          <div>
            <input
              className="mb-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none"
              placeholder="What is on your mind?"
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
          <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600">
            Post
          </button>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        {feed.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
                <div>
                  <strong className="block text-sm text-slate-900">
                    {post.name}
                  </strong>
                  <small className="text-xs text-slate-500">
                    {post.handle} ¡P {post.time}
                  </small>
                </div>
              </div>
              <button className="rounded-full px-3 py-1 text-sm text-slate-500 transition hover:text-slate-900">
                Follow
              </button>
            </div>
            <h4 className="text-base font-semibold text-slate-900">
              {post.title}
            </h4>
            <p className="text-sm text-slate-600">{post.body}</p>
            <div className="flex flex-wrap gap-2 text-sm text-slate-500">
              <button className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                Like {post.likes}
              </button>
              <button className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                Comment {post.comments}
              </button>
              <button className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                Share
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}