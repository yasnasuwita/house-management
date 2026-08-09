import Link from "next/link";

export default function Header({
  title,
  emoji,
  backHref = "/",
}: {
  title: string;
  emoji?: string;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-100 bg-slate-50/95 px-4 py-4 backdrop-blur">
      <Link
        href={backHref}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm active:scale-95"
        aria-label="Kembali"
      >
        ←
      </Link>
      <h1 className="text-lg font-bold text-slate-800">
        {emoji ? `${emoji} ` : ""}
        {title}
      </h1>
    </header>
  );
}
