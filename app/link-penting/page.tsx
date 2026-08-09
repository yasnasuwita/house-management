import Header from "@/components/Header";
import { getLinks } from "@/lib/queries";
import { userLabels } from "@/lib/auth";
import { addLink, deleteLink } from "./actions";

export const dynamic = "force-dynamic";

export default async function LinkPentingPage() {
  const links = await getLinks();
  const [user1, user2] = userLabels();

  return (
    <div>
      <Header title="Link Penting" emoji="🔗" />

      <div className="px-4 py-4">
        <details className="rounded-2xl bg-white p-4 shadow-sm" open>
          <summary className="cursor-pointer text-sm font-semibold text-slate-700">
            + Tambah Link
          </summary>
          <form action={addLink} className="mt-4 space-y-3">
            <input
              type="text"
              name="title"
              placeholder="Nama (mis. KK, Sertifikat Rumah, Polis Asuransi)"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
            />
            <input
              type="text"
              name="url"
              placeholder="Link (Google Drive, dsb.)"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
            />
            <input
              type="text"
              name="category"
              placeholder="Kategori (opsional, mis. Dokumen, Tagihan)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
            />
            <input
              type="text"
              name="notes"
              placeholder="Catatan (opsional)"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
            />
            <select
              name="user_label"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
            >
              <option value={user1}>{user1}</option>
              <option value={user2}>{user2}</option>
            </select>
            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 py-2.5 text-sm font-semibold text-white shadow-md active:bg-purple-700"
            >
              Simpan
            </button>
          </form>
        </details>
      </div>

      <div className="px-4 pb-8">
        <p className="mb-2 text-sm font-semibold text-slate-600">Daftar Link</p>
        {links.length === 0 ? (
          <p className="rounded-xl bg-white p-4 text-center text-sm text-slate-400 shadow-sm">
            Belum ada link tersimpan.
          </p>
        ) : (
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.id} className="rounded-xl bg-white p-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-medium text-purple-700">{link.title}</p>
                    <p className="truncate text-xs text-slate-400">{link.url}</p>
                    {link.category && (
                      <span className="mt-1 inline-block rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-600">
                        {link.category}
                      </span>
                    )}
                    {link.notes && <p className="mt-1 text-xs text-slate-500">{link.notes}</p>}
                  </a>
                  <form action={deleteLink}>
                    <input type="hidden" name="id" value={link.id} />
                    <button type="submit" aria-label="Hapus" className="shrink-0 text-slate-300 active:text-slate-500">
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
