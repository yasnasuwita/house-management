import Link from "next/link";
import MenuGrid from "@/components/MenuGrid";
import { getBalance, getUpcomingReminderCount, getUpcomingEventCount } from "@/lib/queries";
import { formatRupiah } from "@/lib/format";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ balance }, reminderCount, eventCount] = await Promise.all([
    getBalance(),
    getUpcomingReminderCount(),
    getUpcomingEventCount(),
  ]);

  return (
    <div>
      <header className="flex items-center justify-between px-4 pb-2 pt-6">
        <div>
          <p className="text-sm text-slate-500">Selamat datang 👋</p>
          <h1 className="text-xl font-bold text-slate-800">House Management</h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm active:scale-95"
          >
            Keluar
          </button>
        </form>
      </header>

      <div className="px-4 py-3">
        <div
          className={`rounded-2xl p-5 text-white shadow-lg ${
            balance < 0
              ? "bg-gradient-to-br from-rose-600 to-rose-500"
              : "bg-gradient-to-br from-teal-600 to-teal-500"
          }`}
        >
          <p className={`text-sm ${balance < 0 ? "text-rose-100" : "text-teal-100"}`}>Saldo Aktif</p>
          <p className="mt-1 text-2xl font-bold">{formatRupiah(balance)}</p>
        </div>
      </div>

      {(reminderCount > 0 || eventCount > 0) && (
        <div className="flex gap-2 px-4 pb-2 text-xs">
          {reminderCount > 0 && (
            <Link
              href="/maintenance"
              className="rounded-full bg-orange-100 px-3 py-1 font-medium text-orange-700 active:scale-95"
            >
              🔧 {reminderCount} reminder maintenance
            </Link>
          )}
          {eventCount > 0 && (
            <Link
              href="/kalender"
              className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 active:scale-95"
            >
              📅 {eventCount} agenda mendatang
            </Link>
          )}
        </div>
      )}

      <div className="mt-2 px-4 pb-2">
        <p className="mb-3 text-sm font-semibold text-slate-600">Menu</p>
      </div>
      <MenuGrid />
    </div>
  );
}
