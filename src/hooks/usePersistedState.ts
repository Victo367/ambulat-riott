"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { usePathname } from "next/navigation";

const PREFIX = "page-state:";

function buildStorageKey(pathname: string, key: string) {
  return `${PREFIX}${pathname}:${key}`;
}

export function readPersistedValue<T>(
  pathname: string,
  key: string
): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(buildStorageKey(pathname, key));
    if (raw == null) return undefined;
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function isMeaningfulPersistedValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return !Number.isNaN(value);
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(
      isMeaningfulPersistedValue
    );
  }
  return true;
}

export function hasPersistedPageState(pathname: string): boolean {
  if (typeof window === "undefined") return false;
  const prefix = `${PREFIX}${pathname}:`;
  for (let i = 0; i < sessionStorage.length; i++) {
    const storageKey = sessionStorage.key(i);
    if (!storageKey?.startsWith(prefix)) continue;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw == null) continue;
      const parsed = JSON.parse(raw) as unknown;
      if (isMeaningfulPersistedValue(parsed)) return true;
    } catch {
      continue;
    }
  }
  return false;
}

export function clearPageState(pathname: string) {
  if (typeof window === "undefined") return;
  const prefix = `${PREFIX}${pathname}:`;
  const keysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const storageKey = sessionStorage.key(i);
    if (storageKey?.startsWith(prefix)) keysToRemove.push(storageKey);
  }
  keysToRemove.forEach((k) => sessionStorage.removeItem(k));
}

export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const pathname = usePathname();

  const [state, setState] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readPersistedValue<T>(pathname, key);
    if (stored !== undefined) setState(stored);
    setHydrated(true);
  }, [pathname, key]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      sessionStorage.setItem(
        buildStorageKey(pathname, key),
        JSON.stringify(state)
      );
    } catch {
      // quota ou serializacao invalida
    }
  }, [pathname, key, state, hydrated]);

  return [state, setState];
}
