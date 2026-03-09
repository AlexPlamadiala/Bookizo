import { Scissors } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950">
                <Scissors className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-neutral-900">Bookizo</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Platformă de programări online pentru saloane și clienți.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Platformă</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/salons" className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">Saloane</Link></li>
              <li><Link href="/search" className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">Caută disponibilitate</Link></li>
              <li><Link href="/register" className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">Înregistrare</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Pentru saloane</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/register" className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">Listează-ți salonul</Link></li>
              <li><Link href="/dashboard" className="text-sm text-neutral-600 transition-colors hover:text-neutral-900">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-sm text-neutral-600">contact@bookizo.ro</li>
              <li className="text-sm text-neutral-600">+40 700 000 000</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-neutral-100 pt-8 text-center">
          <p className="text-xs text-neutral-400">&copy; {new Date().getFullYear()} Bookizo. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}
