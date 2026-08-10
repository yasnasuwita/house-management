import Header from "@/components/Header";
import { getBalance, getTransactions } from "@/lib/queries";
import { formatRupiah, formatDateShort, todayIso } from "@/lib/format";
import { userLabels } from "@/lib/auth";
import { addTransaction, deleteTransaction } from "./actions";

export const dynamic = "force-dynamic";

export default async function KeuanganPage() {
  const [{ income, expense, balance }, transactions] = await Promise.all([
    getBalance(),
    getTransactions(50),
  ]);
  const [user1, user2] = userLabels();

  return (
    <div>
      <Header title="Keuangan" emoji="💰" />

      <div className="px-4 py-4">
        <div
          className={`rounded-2xl p-5 text-white shadow-lg ${
            balance < 0
              ? "bg-gradient-to-br from-rose-600 to-rose-500"
              : "bg-gradient-to-br from-teal-600 to-teal-500"
          }`}
        >
          <p className={`text-sm ${balance < 0 ? "text-rose-100" : "text-teal-100"}`}>Saldo Aktif</p>
          <p className="mt-1 text-2xl font-bold">{formatRupiah(balance)}</p>
          <div className={`mt-3 flex gap-4 text-xs ${balance < 0 ? "text-rose-50" : "text-teal-50"}`}>
            <span>▲ Pemasukan: {formatRupiah(income)}</span>
            <span>▼ Pengeluaran: {formatRupiah(expense)}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <details className="rounded-2xl bg-white p-4 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">
            + Tambah Transaksi
          </summary>
          <form action={addTransaction} className="mt-4 space-y-3">
            <div className="flex gap-2">
              <label className="flex-1">
                <input type="radio" name="type" value="expense" defaultChecked className="peer hidden" />
                <div className="rounded-xl border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-600">
                  Pengeluaran
                </div>
              </label>
              <label className="flex-1">
                <input type="radio" name="type" value="income" className="peer hidden" />
                <div className="rounded-xl border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-600">
                  Pemasukan
                </div>
              </label>
            </div>

            <input
              type="number"
              name="amount"
              placeholder="Jumlah (Rp)"
              min={1}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
            <input
              type="text"
              name="category"
              placeholder="Kategori (mis. Belanja, Gaji, Listrik)"
              list="kategori-list"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
            <datalist id="kategori-list">
              <option value="Belanja" />
              <option value="Makan" />
              <option value="Transport" />
              <option value="Listrik/Air" />
              <option value="Gaji" />
              <option value="Tagihan" />
              <option value="Lainnya" />
            </datalist>
            <input
              type="text"
              name="description"
              placeholder="Catatan (opsional)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <input
                type="date"
                name="occurred_on"
                defaultValue={todayIso()}
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
              />
              <select
                name="user_label"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
              >
                <option value={user1}>{user1}</option>
                <option value={user2}>{user2}</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-md active:bg-teal-700"
            >
              Simpan
            </button>
          </form>
        </details>
      </div>

      <div className="px-4 pb-8">
        <p className="mb-2 text-sm font-semibold text-slate-600">Riwayat Transaksi</p>
        {transactions.length === 0 ? (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm">
            Belum ada transaksi.
          </p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {t.category}
                    {t.description ? ` · ${t.description}` : ""}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDateShort(t.occurred_on)}
                    {t.user_label ? ` · ${t.user_label}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      t.type === "income" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatRupiah(t.amount)}
                  </span>
                  <form action={deleteTransaction}>
                    <input type="hidden" name="id" value={t.id} />
                    <button
                      type="submit"
                      aria-label="Hapus"
                      className="text-slate-300 active:text-slate-500"
                    >
                      ✕
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
