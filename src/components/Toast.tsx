type ToastProps = {
  message: string;
  type?: "success" | "error";
};

export default function Toast({ message, type = "success" }: ToastProps) {
  const tone =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <div
      className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg ${tone}`}
      role="status"
    >
      {message}
    </div>
  );
}
