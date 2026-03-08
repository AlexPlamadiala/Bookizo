import { Scissors } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-neutral-900" />
              <span className="text-lg font-bold text-neutral-900">Bookizo</span>
            </div>
            <p className="mt-2 text-sm text-neutral-500">
              Programări simple pentru saloane și clienți.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Platformă</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/salons" className="text-sm text-neutral-500 hover:text-neutral-700">Saloane</Link></li>
              <li><Link href="/search" className="text-sm text-neutral-500 hover:text-neutral-700">Caută disponibilitate</Link></li>
              <li><Link href="/register" className="text-sm text-neutral-500 hover:text-neutral-700">Înregistrare</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Pentru saloane</h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/register" className="text-sm text-neutral-500 hover:text-neutral-700">Listează-ți salonul</Link></li>
              <li><Link href="/dashboard" className="text-sm text-neutral-500 hover:text-neutral-700">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">Contact</h3>
            <ul className="mt-3 space-y-2">
              <li className="text-sm text-neutral-500">contact@bookizo.ro</li>
              <li className="text-sm text-neutral-500">+40 700 000 000</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-8 text-center">
          <p className="text-xs text-neutral-400">&copy; {new Date().getFullYear()} Bookizo. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}
