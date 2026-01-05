import { useEffect, useState } from "react";

type PostComposerModalProps = {
  open: boolean;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (body: string, images?: File[], hashtags?: string[]) => Promise<void>;
};

export default function PostComposerModal({
  open,
  loading,
  error,
  onClose,
  onSubmit
}: PostComposerModalProps) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const previews = images.map((file) => ({
    name: file.name,
    url: URL.createObjectURL(file)
  }));

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
        onClick={(event) => event.stopPropagation()}
        role="presentation"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">New post</h3>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            <span aria-hidden="true">x</span>
          </button>
        </div>
        {error ? (
          <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {error}
          </div>
        ) : null}
        <form
          className="flex min-h-[420px] flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = text.trim();
            if (!trimmed) {
              return;
            }
            const tags = hashtags.slice(0, 5);
            const pending = hashtagInput.trim().replace(/^#/, "");
            const finalTags =
              pending && tags.length < 5 ? [...tags, pending] : tags;
            onSubmit(trimmed, images, finalTags).then(() => {
              setText("");
              setImages([]);
              setHashtagInput("");
              setHashtags([]);
            });
          }}
        >
          <textarea
            className="min-h-[120px] w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none"
            placeholder="Share something..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{text.length}/280</span>
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-600">
            <label className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
              Add photos
              <input
                className="hidden"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  const files = event.target.files
                    ? Array.from(event.target.files)
                    : [];
                  setImages(files.slice(0, 15));
                }}
              />
            </label>
            <span className="text-[11px] text-slate-400">
              {images.length > 0
                ? `${images.length} file(s) selected`
                : "Up to 15 images"}
            </span>
          </div>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Hashtags (space to add, up to 5)
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600"
                >
                  #{tag}
                  <button
                    className="text-slate-400 transition hover:text-slate-700"
                    type="button"
                    onClick={() =>
                      setHashtags((prev) => prev.filter((item) => item !== tag))
                    }
                    aria-label={`Remove hashtag ${tag}`}
                  >
                    x
                  </button>
                </span>
              ))}
              {hashtags.length < 5 ? (
                <input
                  className="min-w-[120px] flex-1 border-none text-sm text-slate-700 focus:outline-none"
                  placeholder={hashtags.length === 0 ? "type hashtag" : ""}
                  value={hashtagInput}
                  onChange={(event) => setHashtagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && hashtagInput.length === 0) {
                      setHashtags((prev) => prev.slice(0, -1));
                      return;
                    }
                    if (event.key !== " " && event.key !== "Enter") {
                      return;
                    }
                    event.preventDefault();
                    const next = hashtagInput.trim().replace(/^#/, "");
                    if (!next) {
                      return;
                    }
                    setHashtags((prev) =>
                      prev.length < 5 && !prev.includes(next)
                        ? [...prev, next]
                        : prev
                    );
                    setHashtagInput("");
                  }}
                />
              ) : (
                <span className="text-xs text-slate-400">Max 5</span>
              )}
            </div>
          </label>
          {images.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {previews.map((preview) => (
                <div
                  key={preview.name}
                  className="h-16 w-16 overflow-hidden rounded-lg border border-slate-200"
                >
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-auto flex items-center justify-end">
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
