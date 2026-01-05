import { useMemo, useState } from "react";

type PostImage = {
  id: number;
  order: number;
  image_path: string;
};

type PostImageCarouselProps = {
  images: PostImage[];
};

export default function PostImageCarousel({ images }: PostImageCarouselProps) {
  const sorted = useMemo(
    () => [...images].sort((a, b) => a.order - b.order),
    [images]
  );
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (sorted.length === 0) {
    return null;
  }

  const current = sorted[index];

  return (
    <div className="relative mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <img
        src={current.image_path}
        alt={`Post image ${index + 1}`}
        className="h-64 w-full object-cover"
        onClick={() => setOpen(true)}
        role="presentation"
      />
      {sorted.length > 1 ? (
        <>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/70"
            type="button"
            onClick={() =>
              setIndex((prev) => (prev === 0 ? sorted.length - 1 : prev - 1))
            }
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/70"
            type="button"
            onClick={() =>
              setIndex((prev) => (prev + 1) % sorted.length)
            }
            aria-label="Next image"
          >
            →
          </button>
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
            {index + 1}/{sorted.length}
          </div>
        </>
      ) : null}
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
            role="presentation"
          >
            <img
              src={current.image_path}
              alt={`Post image ${index + 1}`}
              className="max-h-[90vh] w-full rounded-2xl object-contain"
            />
          </div>
          <button
            className="fixed right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90"
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            x
          </button>
        </div>
      ) : null}
    </div>
  );
}
