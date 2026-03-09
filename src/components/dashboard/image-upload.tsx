"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, ImageIcon, X } from "lucide-react";

export function ImageUpload({
  target,
  targetId,
  currentImage,
}: {
  target: "salon" | "specialist";
  targetId: string;
  currentImage?: string | null;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", target);
    formData.append("targetId", targetId);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setPreview(data.url);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Eroare la upload");
      }
    } catch {
      setError("Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-24 w-24 rounded-lg object-cover"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute -right-1 -top-1 rounded-full bg-amber-600 p-0.5 text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 transition-colors hover:border-neutral-400 hover:text-neutral-500"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <ImageIcon className="h-6 w-6" />
          )}
        </button>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="mt-2"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="mr-1 h-3 w-3" />
        {preview ? "Schimbă" : "Încarcă"} imagine
      </Button>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
