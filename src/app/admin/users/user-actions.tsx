"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminUserActions({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const changeRole = async (role: string) => {
    setLoading(true);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={currentRole}
      onChange={(e) => changeRole(e.target.value)}
      disabled={loading}
      className="rounded border border-neutral-200 px-2 py-1 text-xs"
    >
      <option value="CUSTOMER">Client</option>
      <option value="SALON_ADMIN">Partener</option>
      <option value="SUPER_ADMIN">Admin</option>
    </select>
  );
}
