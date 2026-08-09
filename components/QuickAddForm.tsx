"use client";

import { useState } from "react";
import { quickAdd } from "@/app/tambah-cepat/actions";

type Kind = "keuangan" | "maintenance" | "kalender" | "link";

const KIND_OPTIONS: { value: Kind; label: string; emoji: string; color: string }[] = [
  { value: "keuangan", label: "Keuangan", emoji: "💰", color: "border-emerald-500 bg-emerald-50 text-emerald-600" },
  { value: "maintenance", label: "Maintenance", emoji: "🔧", color: "border-orange-500 bg-orange-50 text-orange-600" },
  { value: "kalender", label: "Kalender", emoji: "📅", color: "border-blue-500 bg-blue-50 text-blue-600" },
  { value: "link", label: "Link", emoji: "🔗", color: "border-purple-500 bg-purple-50 text-purple-600" },
];

export default function QuickAddForm({
  user1,
  user2,
  today,
}: {
  user1: string;
  user2: string;
  today: string;
}) {
  const [kind, setKind] = useState<Kind>("keuangan");

  return (
    <form action={quickAdd} className="space-y-4">
      <input type="hidden" name="kind" value={kind} />

      <div className="grid grid-cols-4 gap-2">
        {KIND_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setKind(opt.value)}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-[11px] font-medium ${
              kind === opt.value ? opt.color : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            <span className="text-lg">{opt.emoji}</span>
            {opt.label}
          </button>
        ))}
      </div>

      {kind === "keuangan" && (
        <div className="space-y-3">
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
            placeholder="Kategori (mis. Belanja, Gaji)"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
          />
          <input type="hidden" name="occurred_on" value={today} />
        </div>
      )}

      {kind === "maintenance" && (
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Nama (mis. Servis AC, Ganti Oli)"
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
          <label className="block text-xs text-slate-500">
            Reminder berikutnya
            <input
              type="date"
              name="next_reminder_date"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
            />
          </label>
        </div>
      )}

      {kind === "kalender" && (
        <div className="space-y-3">
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
        </div>
      )}

      {kind === "link" && (
        <div className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Nama link/dokumen"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
          />
          <input
            type="text"
            name="url"
            placeholder="URL"
            required
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
          />
        </div>
      )}

      <select
        name="user_label"
        className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none"
      >
        <option value={user1}>{user1}</option>
        <option value={user2}>{user2}</option>
      </select>

      <button
        type="submit"
        className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white shadow-md active:bg-amber-600"
      >
        Simpan Cepat
      </button>
    </form>
  );
}
