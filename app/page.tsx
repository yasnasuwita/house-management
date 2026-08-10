import Link from "next/link";
import MenuGrid from "@/components/MenuGrid";
import {
  getBalance,
  getMonthlySummary,
  getUpcomingReminderCount,
  getTodayEvents,
} from "@/lib/queries";
import { formatRupiah } from "@/lib/format";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ balance }, monthly, reminderCount, todayEvents] = await Promise.all([
    getBalance(),
    getMonthlySummary(),
    getUpcomingReminderCount(),
    getTodayEvents(),
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

      <div className="mt-2 px-4 pb-2">
        <p className="mb-3 text-sm font-semibold text-slate-600">Menu</p>
      </div>
      <MenuGrid />

      <div className="mt-6 px-4 pb-8">
        <p className="mb-3 text-sm font-semibold text-slate-600">Ringkasan</p>

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

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-xs text-emerald-600">Pemasukan Bulan Ini</p>
            <p className="mt-1 text-lg font-bold text-emerald-700">{formatRupiah(monthly.income)}</p>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4">
            <p className="text-xs text-rose-600">Pengeluaran Bulan Ini</p>
            <p className="mt-1 text-lg font-bold text-rose-700">{formatRupiah(monthly.expense)}</p>
          </div>
        </div>

        {reminderCount > 0 && (
          <Link
            href="/maintenance"
            className="mt-3 block rounded-xl bg-orange-100 px-3 py-2 text-xs font-medium text-orange-700 active:scale-95"
          >
            🔧 {reminderCount} reminder maintenance
          </Link>
        )}

        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-slate-600">Agenda Hari Ini</p>
          {todayEvents.length === 0 ? (
            <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm">
              Tidak ada agenda hari ini.
            </p>
          ) : (
            <ul className="space-y-2">
              {todayEvents.map((e) => (
                <li key={e.id} className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-sm font-medium text-slate-800">{e.title}</p>
                  {e.notes && <p className="mt-0.5 text-xs text-slate-500">{e.notes}</p>}
                  {e.user_label && <p className="mt-0.5 text-xs text-slate-400">Oleh: {e.user_label}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
