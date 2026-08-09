import Header from "@/components/Header";
import { getCalendarEvents } from "@/lib/queries";
import { formatDate, todayIso } from "@/lib/format";
import { userLabels } from "@/lib/auth";
import { addCalendarEvent, deleteCalendarEvent } from "./actions";
import type { CalendarEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

function EventList({ events, emptyLabel }: { events: CalendarEvent[]; emptyLabel: string }) {
  if (events.length === 0) {
    return (
      <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm">
        {emptyLabel}
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {events.map((e) => (
        <li key={e.id} className="flex items-start justify-between gap-2 rounded-xl bg-white p-3 shadow-sm">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">{e.title}</p>
            <p className="text-xs text-slate-400">{formatDate(e.event_date)}</p>
            {e.notes && <p className="mt-1 text-xs text-slate-500">{e.notes}</p>}
            {e.user_label && <p className="mt-1 text-xs text-slate-400">Oleh: {e.user_label}</p>}
          </div>
          <form action={deleteCalendarEvent}>
            <input type="hidden" name="id" value={e.id} />
            <button type="submit" aria-label="Hapus" className="shrink-0 text-slate-300 active:text-slate-500">
              ✕
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}

export default async function KalenderPage() {
  const events = await getCalendarEvents();
  const [user1, user2] = userLabels();
  const today = todayIso();

  const upcoming = events.filter((e) => e.event_date >= today);
  const past = events.filter((e) => e.event_date < today).reverse();

  return (
    <div>
      <Header title="Kalender" emoji="📅" />

      <div className="px-4 py-4">
        <details className="rounded-2xl bg-white p-4 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">
            + Tambah Agenda
          </summary>
          <form action={addCalendarEvent} className="mt-4 space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Judul agenda"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <input
              type="date"
              name="event_date"
              defaultValue={today}
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="notes"
              placeholder="Catatan (opsional)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
            <select
              name="user_label"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value={user1}>{user1}</option>
              <option value={user2}>{user2}</option>
            </select>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md active:bg-blue-700"
            >
              Simpan
            </button>
          </form>
        </details>
      </div>

      <div className="space-y-6 px-4 pb-8">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-600">Akan Datang</p>
          <EventList events={upcoming} emptyLabel="Belum ada agenda mendatang." />
        </div>
        {past.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-600">Sudah Lewat</p>
            <EventList events={past} emptyLabel="" />
          </div>
        )}
      </div>
    </div>
  );
}
