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

export function hasPersistedPageState(pathname: string): boolean {
  if (typeof window === "undefined") return false;
  const prefix = `${PREFIX}${pathname}:`;
  for (let i = 0; i < sessionStorage.length; i++) {
    const storageKey = sessionStorage.key(i);
    if (storageKey?.startsWith(prefix)) return true;
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

  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    return readPersistedValue<T>(pathname, key) ?? initialValue;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(
        buildStorageKey(pathname, key),
        JSON.stringify(state)
      );
    } catch {
      // quota ou serializacao invalida
    }
  }, [pathname, key, state]);

  return [state, setState];
}
