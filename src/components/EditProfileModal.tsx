import { useEffect, useMemo, useState } from "react";
import type { UpdateUserPayload, UserSummary } from "../api/users";

type EditProfileModalProps = {
  open: boolean;
  user: UserSummary | null;
  loading: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: UpdateUserPayload) => Promise<void>;
};

export default function EditProfileModal({
  open,
  user,
  loading,
  error,
  onClose,
  onSubmit
}: EditProfileModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  const avatarPreview = useMemo(() => {
    if (!avatar) {
      return null;
    }
    return URL.createObjectURL(avatar);
  }, [avatar]);

  const coverPreview = useMemo(() => {
    if (!cover) {
      return null;
    }
    return URL.createObjectURL(cover);
  }, [cover]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview);
      }
    };
  }, [avatarPreview, coverPreview]);

  useEffect(() => {
    if (!open || !user) {
      return;
    }
    setEmail(user.email ?? "");
    setName(user.name ?? "");
    setUsername(user.username ?? "");
    setDescription(user.description ?? "");
    setAvatar(null);
    setCover(null);
  }, [open, user]);

  if (!open || !user) {
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
          <h3 className="text-base font-semibold text-slate-900">
            Edit profile
          </h3>
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
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({
              email,
              name,
              username,
              description,
              avatar_image: avatar,
              cover_image: cover
            });
          }}
        >
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 text-xs font-semibold text-slate-500">
              Preview
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="h-28 bg-gradient-to-br from-amber-200 via-orange-300 to-rose-400">
                {(coverPreview || user.cover_path) ? (
                  <img
                    src={coverPreview ?? user.cover_path ?? ""}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="-mt-8 flex items-center gap-3 px-4 pb-4">
                {avatarPreview || user.avatar_path ? (
                  <img
                    src={avatarPreview ?? user.avatar_path ?? ""}
                    alt="Avatar preview"
                    className="h-14 w-14 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full border-2 border-white bg-gradient-to-br from-amber-200 to-emerald-400" />
                )}
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {name || user.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    @{username || user.username}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Email
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Name
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Username
            <input
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-600">
            Description
            <textarea
              className="min-h-[90px] resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-slate-300 focus:outline-none"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <span>Avatar image</span>
              <label className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                Choose file
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setAvatar(event.target.files ? event.target.files[0] : null)
                  }
                />
              </label>
              <span className="text-[11px] text-slate-400">
                {avatar ? avatar.name : "No file selected"}
              </span>
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <span>Cover image</span>
              <label className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
                Choose file
                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setCover(event.target.files ? event.target.files[0] : null)
                  }
                />
              </label>
              <span className="text-[11px] text-slate-400">
                {cover ? cover.name : "No file selected"}
              </span>
            </div>
          </div>
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
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
