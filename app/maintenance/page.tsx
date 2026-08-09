import Header from "@/components/Header";
import { getMaintenanceItems } from "@/lib/queries";
import { formatDate, todayIso } from "@/lib/format";
import { userLabels } from "@/lib/auth";
import { addMaintenanceItem, deleteMaintenanceItem } from "./actions";

export const dynamic = "force-dynamic";

function reminderStatus(nextDate: string | null): { label: string; className: string } | null {
  if (!nextDate) return null;
  const today = new Date(todayIso());
  const target = new Date(nextDate);
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: "Terlewat", className: "bg-rose-100 text-rose-700" };
  if (diffDays <= 14) return { label: "Segera", className: "bg-amber-100 text-amber-700" };
  return { label: "Terjadwal", className: "bg-slate-100 text-slate-600" };
}

export default async function MaintenancePage() {
  const items = await getMaintenanceItems();
  const [user1, user2] = userLabels();

  return (
    <div>
      <Header title="Maintenance" emoji="🔧" />

      <div className="px-4 py-4">
        <details className="rounded-2xl bg-white p-4 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">
            + Tambah Catatan
          </summary>
          <form action={addMaintenanceItem} className="mt-4 space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Nama (mis. Servis AC, Ganti Oli Mobil)"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <label className="flex-1">
                <input type="radio" name="category" value="rumah" defaultChecked className="peer hidden" />
                <div className="rounded-xl border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-600">
                  🏠 Rumah
                </div>
              </label>
              <label className="flex-1">
                <input type="radio" name="category" value="kendaraan" className="peer hidden" />
                <div className="rounded-xl border border-slate-200 py-2 text-center text-sm font-medium text-slate-600 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-600">
                  🚗 Kendaraan
                </div>
              </label>
            </div>
            <div className="flex gap-2">
              <label className="flex-1 text-xs text-slate-500">
                Terakhir servis
                <input
                  type="date"
                  name="last_service_date"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </label>
              <label className="flex-1 text-xs text-slate-500">
                Reminder berikutnya
                <input
                  type="date"
                  name="next_reminder_date"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </label>
            </div>
            <input
              type="text"
              name="notes"
              placeholder="Catatan (opsional)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
            />
            <select
              name="user_label"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
            >
              <option value={user1}>{user1}</option>
              <option value={user2}>{user2}</option>
            </select>
            <button
              type="submit"
              className="w-full rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-md active:bg-orange-600"
            >
              Simpan
            </button>
          </form>
        </details>
      </div>

      <div className="px-4 pb-8">
        <p className="mb-2 text-sm font-semibold text-slate-600">Daftar Maintenance</p>
        {items.length === 0 ? (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm">
            Belum ada catatan maintenance.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => {
              const status = reminderStatus(item.next_reminder_date);
              return (
                <li key={item.id} className="rounded-xl bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {item.category === "rumah" ? "🏠" : "🚗"} {item.title}
                      </p>
                      {item.next_reminder_date && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          Reminder: {formatDate(item.next_reminder_date)}
                        </p>
                      )}
                      {item.last_service_date && (
                        <p className="text-xs text-slate-400">
                          Terakhir servis: {formatDate(item.last_service_date)}
                        </p>
                      )}
                      {item.notes && <p className="mt-1 text-xs text-slate-500">{item.notes}</p>}
                      {item.user_label && (
                        <p className="mt-1 text-xs text-slate-400">Oleh: {item.user_label}</p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      {status && (
                        <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold ${status.className}`}>
                          {status.label}
                        </span>
                      )}
                      <form action={deleteMaintenanceItem}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" aria-label="Hapus" className="text-slate-300 active:text-slate-500">
                          ✕
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
