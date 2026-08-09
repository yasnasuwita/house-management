import Header from "@/components/Header";
import { getMonthlySummary, getBalance } from "@/lib/queries";
import { formatRupiah, monthLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function LaporanPage() {
  const [summary, { balance }] = await Promise.all([getMonthlySummary(), getBalance()]);

  const expenseByCategory = summary.byCategory
    .filter((c) => c.type === "expense")
    .sort((a, b) => b.total - a.total);
  const incomeByCategory = summary.byCategory
    .filter((c) => c.type === "income")
    .sort((a, b) => b.total - a.total);

  const maxExpense = expenseByCategory[0]?.total ?? 0;

  return (
    <div>
      <Header title="Laporan Keuangan" emoji="📊" />

      <div className="space-y-4 px-4 py-4">
        <p className="text-sm font-semibold text-slate-600">Rekap {monthLabel()}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-xs text-emerald-600">Pemasukan</p>
            <p className="mt-1 text-lg font-bold text-emerald-700">{formatRupiah(summary.income)}</p>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4">
            <p className="text-xs text-rose-600">Pengeluaran</p>
            <p className="mt-1 text-lg font-bold text-rose-700">{formatRupiah(summary.expense)}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-800 p-4 text-white">
          <p className="text-xs text-slate-300">Selisih Bulan Ini</p>
          <p className="mt-1 text-lg font-bold">{formatRupiah(summary.balance)}</p>
          <p className="mt-1 text-xs text-slate-400">Saldo aktif keseluruhan: {formatRupiah(balance)}</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-600">Pengeluaran per Kategori</p>
          {expenseByCategory.length === 0 ? (
            <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm">
              Belum ada pengeluaran bulan ini.
            </p>
          ) : (
            <div className="space-y-2 rounded-xl bg-white p-4 shadow-sm">
              {expenseByCategory.map((c) => (
                <div key={c.category}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">{c.category}</span>
                    <span className="text-slate-500">{formatRupiah(c.total)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-rose-500"
                      style={{ width: `${maxExpense ? (c.total / maxExpense) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-slate-600">Pemasukan per Kategori</p>
          {incomeByCategory.length === 0 ? (
            <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm">
              Belum ada pemasukan bulan ini.
            </p>
          ) : (
            <ul className="space-y-2 rounded-xl bg-white p-4 shadow-sm">
              {incomeByCategory.map((c) => (
                <li key={c.category} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{c.category}</span>
                  <span className="font-medium text-emerald-600">{formatRupiah(c.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
