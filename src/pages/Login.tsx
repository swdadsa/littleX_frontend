import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const handle = window.setTimeout(() => setToast(null), 2000);
    return () => window.clearTimeout(handle);
  }, [toast]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login({ email, password });
      setToast("Login successful.");
      window.setTimeout(() => navigate("/explore"), 600);
    } catch {
      // Error is handled in the hook.
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {toast ? (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
          <Toast message={toast} type="success" />
        </div>
      ) : null}
      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-10 lg:grid-cols-2 lg:px-8">
        <section className="flex flex-col justify-center gap-5 rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-amber-200 p-8 text-white shadow-lg sm:p-10">
          <div className="text-xs uppercase tracking-[2px] text-white/80">
            LittleX Social
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl">
          Share fast, build slow, stay human.
          </h1>
          <p className="text-sm text-white/90 sm:text-base">
          A focused space for updates, highlights, and the small details that
          matter. Log in to follow your teams and the creators you care about.
          </p>
          <div className="flex flex-wrap gap-5 text-sm text-white/90">
            <div>
              <strong className="block text-2xl text-white">1.4k</strong>
              <span>active voices</span>
            </div>
            <div>
              <strong className="block text-2xl text-white">8m</strong>
              <span>daily reads</span>
            </div>
            <div>
              <strong className="block text-2xl text-white">5x</strong>
              <span>focus rate</span>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center">
          <div className="w-full max-w-[420px] rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Use your workspace credentials to continue.
            </p>
            <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                Email
                <input
                  type="email"
                  placeholder="you@studio.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-300 focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-600">
                Password
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="rounded-xl border border-slate-200 px-3 py-2 text-slate-900 focus:border-slate-300 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-500">
                <input type="checkbox" defaultChecked />
                <span>Keep me signed in</span>
              </label>
              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {error}
                </div>
              ) : null}
              <button
                className="rounded-full bg-orange-500 px-4 py-2 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <div className="mt-5 flex items-center justify-between text-sm">
              <button
                className="rounded-full px-3 py-2 text-slate-500 transition hover:text-slate-900"
                type="button"
              >
                Use token instead
              </button>
              <button
                className="rounded-full px-3 py-2 text-slate-500 transition hover:text-slate-900"
                type="button"
              >
                Need help?
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
