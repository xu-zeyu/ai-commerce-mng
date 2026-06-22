"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  const frameId = window.requestAnimationFrame(onStoreChange);
  return () => window.cancelAnimationFrame(frameId);
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function useMounted() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
