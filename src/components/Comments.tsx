import { useState } from "react";
import { useCommentActions, useComments } from "../hooks/useComments";
import { formatRelativeTime } from "../utils/time";

type CommentsProps = {
  postId: number;
  open: boolean;
};

export default function Comments({ postId, open }: CommentsProps) {
  const { comments, loading, error, reload } = useComments(postId, open);
  const { likeComment, addComment, actionLoadingId, creating, error: actionErr } =
    useCommentActions(postId, reload);
  const [text, setText] = useState("");

  if (!open) {
    return null;
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      <form
        className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = text.trim();
          if (!trimmed) {
            return;
          }
          addComment(trimmed).then(() => setText(""));
        }}
      >
        <textarea
          className="min-h-[72px] w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:border-slate-300 focus:outline-none"
          placeholder="Write a comment..."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {text.length}/280
          </span>
          <button
            className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={creating}
          >
            {creating ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
          Loading comments...
        </div>
      ) : null}
      {error || actionErr ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          {error ?? actionErr}
        </div>
      ) : null}
      {!loading && !error && comments.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
          No comments yet.
        </div>
      ) : null}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3"
        >
          {comment.user_avatar ? (
            <img
              src={comment.user_avatar}
              alt={comment.user_name}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-200 to-emerald-400" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <strong className="text-xs text-slate-900">
                  {comment.user_name}
                </strong>
                <span className="text-[11px] text-slate-500">
                  @{comment.user_username}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {formatRelativeTime(comment.created_at)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">{comment.comment}</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <button
                className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
                type="button"
                onClick={() => likeComment(comment.id)}
                disabled={actionLoadingId === comment.id}
              >
                讚 {comment.likes_count}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
