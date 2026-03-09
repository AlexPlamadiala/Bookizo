"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, X, Scissors, Heart, CalendarDays, LayoutDashboard, Shield } from "lucide-react";
import { useState } from "react";
import { NotificationBell } from "./notification-bell";

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = session?.user?.role === "SALON_ADMIN" || session?.user?.role === "SUPER_ADMIN";
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950">
            <Scissors className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900">Bookizo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/salons" className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
            Saloane
          </Link>
          <Link href="/search" className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
            Caută disponibilitate
          </Link>
          {isAdmin && (
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
              Dashboard
            </Link>
          )}
          {isSuperAdmin && (
            <Link href="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700">
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <>
              <NotificationBell />
              <Link href="/favorites" className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600" title="Favorite">
                <Heart className="h-5 w-5" />
              </Link>
              <Link href="/my-bookings" className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600" title="Programările mele">
                <CalendarDays className="h-5 w-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-neutral-200" />
              <span className="max-w-[140px] truncate text-sm text-neutral-500">{session.user?.name || session.user?.email}</span>
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-neutral-500 hover:text-neutral-700">
                Deconectare
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Conectare</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Înregistrare</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-neutral-100 bg-white px-4 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link href="/salons" className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50" onClick={() => setMobileOpen(false)}>
              Saloane
            </Link>
            <Link href="/search" className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50" onClick={() => setMobileOpen(false)}>
              Caută disponibilitate
            </Link>
            {isAdmin && (
              <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50" onClick={() => setMobileOpen(false)}>
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            {isSuperAdmin && (
              <Link href="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50" onClick={() => setMobileOpen(false)}>
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            )}

            <div className="my-2 border-t border-neutral-100" />

            {session ? (
              <>
                <Link href="/my-bookings" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50" onClick={() => setMobileOpen(false)}>
                  <CalendarDays className="h-4 w-4" />
                  Programările mele
                </Link>
                <Link href="/favorites" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50" onClick={() => setMobileOpen(false)}>
                  <Heart className="h-4 w-4" />
                  Favorite
                </Link>
                <div className="my-2 border-t border-neutral-100" />
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-neutral-500">{session.user?.name || session.user?.email}</span>
                  <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-neutral-500">
                    Deconectare
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Conectare</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Înregistrare</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
