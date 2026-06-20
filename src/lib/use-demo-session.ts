"use client";

import { useSyncExternalStore } from "react";
import {
  DEMO_SESSION_EVENT,
  DEMO_SESSION_STORAGE_KEY,
  readDemoSession,
} from "@/lib/demo-auth";

function subscribe(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === DEMO_SESSION_STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener(DEMO_SESSION_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(DEMO_SESSION_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useDemoSession() {
  const session = useSyncExternalStore(subscribe, readDemoSession, () => null);

  return {
    isReady: true,
    session,
  };
}
