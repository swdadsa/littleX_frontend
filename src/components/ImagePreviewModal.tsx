type ImagePreviewModalProps = {
  src: string | null;
  alt?: string;
  open: boolean;
  onClose: () => void;
};

export default function ImagePreviewModal({
  src,
  alt = "Preview",
  open,
  onClose
}: ImagePreviewModalProps) {
  if (!open || !src) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl"
        onClick={(event) => event.stopPropagation()}
        role="presentation"
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[90vh] w-full rounded-2xl object-contain"
        />
      </div>
      <button
        className="fixed right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90"
        type="button"
        onClick={onClose}
        aria-label="Close"
      >
        x
      </button>
    </div>
  );
}
