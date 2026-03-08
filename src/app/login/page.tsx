"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email sau parolă incorectă");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Scissors className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Conectare</CardTitle>
          <p className="text-sm text-neutral-500">
            Intră în contul tău Bookizo
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplu.ro"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Parolă</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Se conectează...</>
              ) : (
                "Conectare"
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-neutral-500">
            Nu ai cont?{" "}
            <Link href="/register" className="font-medium text-neutral-900 hover:underline">
              Înregistrează-te
            </Link>
          </p>
          <div className="mt-4 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-500">
            <p className="font-medium mb-1">Conturi demo (parolă: password123):</p>
            <p>Super Admin: superadmin@bookizo.ro</p>
            <p>Partener: admin@bookizo.ro</p>
            <p>Client: client@bookizo.ro</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
