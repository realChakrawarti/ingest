"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import Log from "../utils/terminal-logger";

const getLocalStorageItem = (key: string) => {
  return window.localStorage.getItem(key);
};

const useLocalStorageSubscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

function dispatchStorageEvent(key: string, newValue: any) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

const setLocalStorageItem = (key: string, value: any) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

export function useLocalStorage<T>(key: string, initialValue: T | null) {
  const getLocalStorageServerSnapshot = () => {
    Log.warn("useLocalStorage is a client-only hook");
    if (initialValue !== null) return JSON.stringify(initialValue);
    return null;
  };

  const getSnapshot = () => getLocalStorageItem(key);

  const store = useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot
  ) as string;

  const setState = useCallback(
    (v: any) => {
      try {
        const nextState = typeof v === "function" ? v(JSON.parse(store)) : v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store]
  );

  useEffect(() => {
    if (
      getLocalStorageItem(key) === null &&
      typeof initialValue !== "undefined"
    ) {
      setLocalStorageItem(key, initialValue);
    }
  }, [key, initialValue]);

  const state = store ? (JSON.parse(store) as T) : initialValue;

  return [state, setState] as [T, (v: any) => void];
}
