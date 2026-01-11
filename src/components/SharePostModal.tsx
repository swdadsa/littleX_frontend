import { FormEvent, useEffect, useState } from "react";

type SharePostModalProps = {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (body: string) => Promise<void> | void;
};

export default function SharePostModal({
  open,
  loading,
  error,
  onClose,
  onSubmit
}: SharePostModalProps) {
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!open) {
      setBody("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) {
      return;
    }
    await onSubmit(trimmed);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
        onClick={(event) => event.stopPropagation()}
        role="presentation"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Share post</h3>
          <button
            className="rounded-full px-2 text-lg text-slate-500 transition hover:text-slate-900"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <textarea
            className="min-h-[120px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none"
            placeholder="Write something about this post..."
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </div>
          ) : null}
          <div className="flex items-center justify-end gap-2">
            <button
              className="rounded-full px-4 py-2 text-sm text-slate-600 transition hover:text-slate-900"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={loading || !body.trim()}
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
