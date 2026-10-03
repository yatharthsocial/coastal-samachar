"use client";

import { useCallback, useSyncExternalStore } from "react";

// Tiny localStorage-backed store. Everything here lives only in the reader's
// browser — there is no backend.

const EVENT = "cs-store";

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

const snapshots = new Map<string, { raw: string | null; value: unknown }>();

export function useStored<T>(key: string, fallback: T) {
  const getSnapshot = () => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {}
    const cached = snapshots.get(key);
    if (cached && cached.raw === raw) return cached.value as T;
    const value = raw ? read(key, fallback) : fallback;
    snapshots.set(key, { raw, value });
    return value;
  };
  const value = useSyncExternalStore(subscribe, getSnapshot, () => fallback);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = read(key, fallback);
      const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {}
      window.dispatchEvent(new Event(EVENT));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, set] as const;
}

const EMPTY: string[] = [];

export function useBookmarks() {
  const [list, setList] = useStored<string[]>("cs-bookmarks", EMPTY);
  const toggle = (slug: string) => {
    const saved = list.includes(slug);
    setList((l) => (saved ? l.filter((s) => s !== slug) : [...l, slug]));
    return !saved;
  };
  return { list, has: (slug: string) => list.includes(slug), toggle };
}

export function useLikes() {
  const [list, setList] = useStored<string[]>("cs-likes", EMPTY);
  const toggle = (slug: string) =>
    setList((l) => (l.includes(slug) ? l.filter((s) => s !== slug) : [...l, slug]));
  return { has: (slug: string) => list.includes(slug), toggle };
}
