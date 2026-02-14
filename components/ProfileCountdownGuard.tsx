"use client";

import { useCallback, useEffect, useState } from "react";

const DURATION_SECONDS = 30 * 60; // 30 minuti
const STORAGE_KEY = "profile_edit_start";

function getStoredStartTime(): number | null {
  if (typeof window === "undefined") return null;
  const s = sessionStorage.getItem(STORAGE_KEY);
  if (!s) return null;
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? null : n;
}

function setStoredStartTime(ts: number) {
  sessionStorage.setItem(STORAGE_KEY, String(ts));
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  children: React.ReactNode;
};

export default function ProfileCountdownGuard({ children }: Props) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const computeRemaining = useCallback(() => {
    let start = getStoredStartTime();
    if (start == null) {
      start = Date.now();
      setStoredStartTime(start);
    }
    const elapsed = Math.floor((Date.now() - start) / 1000);
    return Math.max(0, DURATION_SECONDS - elapsed);
  }, []);

  useEffect(() => {
    setMounted(true);
    setRemaining(computeRemaining());
  }, [computeRemaining]);

  useEffect(() => {
    if (!mounted || remaining === null) return;
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      const r = computeRemaining();
      setRemaining(r);
      if (r <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted, remaining, computeRemaining]);

  if (!mounted) {
    return (
      <div className="animate-pulse rounded-lg bg-stone-100 p-6">
        <div className="h-6 w-48 rounded bg-stone-200" />
      </div>
    );
  }

  if (remaining !== null && remaining <= 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-6 text-center">
        <p className="font-medium text-amber-800">
          Il tempo per modificare o eliminare l&apos;account è scaduto.
        </p>
        <p className="mt-2 text-sm text-amber-700">
          Effettua nuovamente l&apos;accesso per ottenere una nuova sessione di 30 minuti.
        </p>
        <p className="mt-4">
          <a
            href="/dashboard"
            className="text-sm font-medium text-amber-800 underline hover:no-underline"
          >
            ← Torna alla dashboard
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <span className="text-sm font-medium text-amber-800">
          Hai 30 minuti per eliminare o modificare l&apos;account.
        </span>
        <span
          className="font-mono text-lg font-semibold tabular-nums text-amber-900"
          aria-live="polite"
        >
          {remaining !== null ? formatTime(remaining) : "--:--"}
        </span>
      </div>
      {children}
    </div>
  );
}
