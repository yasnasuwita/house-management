import Header from "@/components/Header";
import { getTodoItems } from "@/lib/queries";
import { userLabels } from "@/lib/auth";
import { addTodoItem, toggleTodoItem, deleteTodoItem } from "./actions";

export const dynamic = "force-dynamic";

export default async function CatatanPage() {
  const items = await getTodoItems();
  const [user1, user2] = userLabels();

  const pending = items.filter((i) => !i.is_done);
  const done = items.filter((i) => i.is_done);

  return (
    <div>
      <Header title="Catatan" emoji="📝" />

      <div className="px-4 py-4">
        <details className="rounded-2xl bg-white p-4 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">
            + Tambah Catatan
          </summary>
          <form action={addTodoItem} className="mt-4 space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Mis. Beli galon, bayar iuran RT"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
            />
            <select
              name="user_label"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value={user1}>{user1}</option>
              <option value={user2}>{user2}</option>
            </select>
            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-600 py-2.5 text-sm font-semibold text-white shadow-md active:bg-cyan-700"
            >
              Simpan
            </button>
          </form>
        </details>
      </div>

      <div className="space-y-6 px-4 pb-8">
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-600">Belum Selesai</p>
          {pending.length === 0 ? (
            <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm">
              Belum ada catatan.
            </p>
          ) : (
            <ul className="space-y-2">
              {pending.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2 rounded-xl bg-white p-3 shadow-sm">
                  <form action={toggleTodoItem} className="flex min-w-0 flex-1 items-center gap-3">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="is_done" value={String(item.is_done)} />
                    <button
                      type="submit"
                      aria-label="Tandai selesai"
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-cyan-500"
                    />
                    <span className="truncate text-left text-sm text-slate-800">
                      {item.title}
                      {item.user_label ? (
                        <span className="ml-2 text-xs text-slate-400">· {item.user_label}</span>
                      ) : null}
                    </span>
                  </form>
                  <form action={deleteTodoItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" aria-label="Hapus" className="shrink-0 text-slate-300 active:text-slate-500">
                      ✕
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>

        {done.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-600">Selesai</p>
            <ul className="space-y-2">
              {done.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2 rounded-xl bg-white p-3 shadow-sm">
                  <form action={toggleTodoItem} className="flex min-w-0 flex-1 items-center gap-3">
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="is_done" value={String(item.is_done)} />
                    <button
                      type="submit"
                      aria-label="Tandai belum selesai"
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-xs text-white"
                    >
                      ✓
                    </button>
                    <span className="truncate text-left text-sm text-slate-400 line-through">
                      {item.title}
                    </span>
                  </form>
                  <form action={deleteTodoItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" aria-label="Hapus" className="shrink-0 text-slate-300 active:text-slate-500">
                      ✕
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
