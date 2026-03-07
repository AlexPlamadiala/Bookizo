"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, X, Scissors } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = session?.user?.role === "SALON_ADMIN" || session?.user?.role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="h-6 w-6 text-neutral-900" />
          <span className="text-xl font-bold tracking-tight text-neutral-900">Bookizo</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/salons" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            Saloane
          </Link>
          {isAdmin && (
            <Link href="/dashboard" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Dashboard
            </Link>
          )}
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-500">{session.user?.name || session.user?.email}</span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Deconectare
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Conectare</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Înregistrare</Button>
              </Link>
            </div>
          )}
        </nav>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/salons" className="text-sm font-medium text-neutral-600" onClick={() => setMobileOpen(false)}>
              Saloane
            </Link>
            {isAdmin && (
              <Link href="/dashboard" className="text-sm font-medium text-neutral-600" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
            )}
            {session ? (
              <>
                <span className="text-sm text-neutral-500">{session.user?.name}</span>
                <Button variant="outline" size="sm" onClick={() => signOut()}>Deconectare</Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Conectare</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">Înregistrare</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
