import Link from "next/link";

const MENU_ITEMS = [
  { href: "/keuangan", label: "Keuangan", emoji: "💰", color: "bg-emerald-500" },
  { href: "/kalender", label: "Kalender", emoji: "📅", color: "bg-blue-500" },
  { href: "/maintenance", label: "Maintenance", emoji: "🔧", color: "bg-orange-500" },
  { href: "/link-penting", label: "Link Penting", emoji: "🔗", color: "bg-purple-500" },
  { href: "/laporan", label: "Laporan Keuangan", emoji: "📊", color: "bg-pink-500" },
  { href: "/catatan", label: "Catatan", emoji: "📝", color: "bg-cyan-500" },
];

export default function MenuGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 px-4">
      {MENU_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center gap-2 rounded-2xl bg-white p-3 text-center shadow-sm active:scale-95"
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-white shadow-md ${item.color}`}
          >
            {item.emoji}
          </span>
          <span className="text-xs font-medium leading-tight text-slate-700">
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
