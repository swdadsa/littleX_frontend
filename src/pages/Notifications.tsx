import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchNotifications, type NotificationItem } from "../api/notifications";
import { getApiErrorMessage } from "../utils/apiError";
import { formatRelativeTime } from "../utils/time";

export default function Notifications() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchNotifications()
      .then((data) => {
        if (active) {
          setItems(data);
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
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            Notifications
          </h3>
        </div>
        {loading ? (
          <div className="text-sm text-slate-500">Loading notifications...</div>
        ) : null}
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}
        {!loading && !error && items.length === 0 ? (
          <div className="text-sm text-slate-500">No notifications yet.</div>
        ) : null}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-300 hover:bg-white"
              type="button"
              onClick={() => {
                const dataType = item.data.type;
                if (dataType === "user_follow" && item.user.username) {
                  navigate(`/profile/${item.user.username}`);
                  return;
                }
                if (dataType === "post_comment" && item.data.post_id) {
                  navigate(`/post/${item.data.post_id}`, {
                    state: { highlightCommentId: item.data.comment_id }
                  });
                  return;
                }
                if (dataType === "post_liked" && item.data.post_id) {
                  navigate(`/post/${item.data.post_id}`);
                }
              }}
            >
              {item.user.avatar_path ? (
                <img
                  src={item.user.avatar_path}
                  alt={item.user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
              )}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm text-slate-900">
                    {item.user.name}
                  </strong>
                  <span className="text-xs text-slate-500">
                    @{item.user.username}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatRelativeTime(item.created_at)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {item.data.message}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
