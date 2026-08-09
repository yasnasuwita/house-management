import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-b from-teal-50 to-white px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-3xl shadow-lg">
            🏠
          </div>
          <h1 className="text-xl font-bold text-slate-800">House Management</h1>
          <p className="mt-1 text-sm text-slate-500">Masukkan PIN untuk masuk</p>
        </div>

        <form action={loginAction} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            name="pin"
            placeholder="PIN"
            autoFocus
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-lg tracking-widest shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          />

          {error === "1" && (
            <p className="text-center text-sm text-red-500">PIN salah, coba lagi.</p>
          )}
          {error === "config" && (
            <p className="text-center text-sm text-red-500">
              Environment variable APP_PIN belum diset di Vercel.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-teal-600 py-3 font-semibold text-white shadow-md active:bg-teal-700"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
