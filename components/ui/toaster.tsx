"use client";

import { useEffect, useState } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastListeners: ((toast: Toast) => void)[] = [];
let toastCounter = 0;

export function toast({
  title,
  description,
  variant = "default",
}: Omit<Toast, "id">) {
  const id = String(++toastCounter);
  toastListeners.forEach((listener) =>
    listener({ id, title, description, variant })
  );
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== t.id));
      }, 5000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg border px-4 py-3 shadow-lg transition-all animate-in slide-in-from-bottom-5 ${
            t.variant === "destructive"
              ? "border-destructive bg-destructive text-destructive-foreground"
              : "border-border bg-background text-foreground"
          }`}
        >
          <p className="text-sm font-semibold">{t.title}</p>
          {t.description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {t.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
