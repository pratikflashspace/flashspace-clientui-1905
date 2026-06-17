type StorageArea = "local" | "session";

const getStorage = (area: StorageArea): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    return area === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

export const canUseBrowserStorage = (area: StorageArea) => {
  const storage = getStorage(area);
  if (!storage) return false;

  try {
    const key = "__flashspace_storage_test__";
    storage.setItem(key, "1");
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const safeStorageGet = (area: StorageArea, key: string) => {
  try {
    return getStorage(area)?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

export const safeStorageSet = (area: StorageArea, key: string, value: string) => {
  try {
    getStorage(area)?.setItem(key, value);
  } catch {
    // Safari can throw when storage is restricted; rendering should continue.
  }
};

export const safeStorageRemove = (area: StorageArea, key: string) => {
  try {
    getStorage(area)?.removeItem(key);
  } catch {
    // Ignore storage failures so the app does not white-screen.
  }
};
