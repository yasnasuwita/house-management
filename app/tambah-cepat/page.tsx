import Header from "@/components/Header";
import QuickAddForm from "@/components/QuickAddForm";
import { userLabels } from "@/lib/auth";
import { todayIso } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function TambahCepatPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const [user1, user2] = userLabels();

  return (
    <div>
      <Header title="Tambah Cepat" emoji="⚡" />

      <div className="px-4 py-4">
        {success === "1" && (
          <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">
            Tersimpan!
          </div>
        )}
        <p className="mb-3 text-sm text-slate-500">
          Pilih jenis data, isi singkat, langsung simpan.
        </p>
        <QuickAddForm user1={user1} user2={user2} today={todayIso()} />
      </div>
    </div>
  );
}
