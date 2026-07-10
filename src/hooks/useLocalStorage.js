import { useState, useEffect, useCallback } from "react";
import storage from "../services/storage.js";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      setValue((prev) => {
        const val = typeof newValue === "function" ? newValue(prev) : newValue;
        localStorage.setItem(key, JSON.stringify(val));
        return val;
      });
    },
    [key]
  );

  return [value, setStoredValue];
}

export function useStorage(collection) {
  const [data, setData] = useState(() => storage[collection]?.getAll() || []);

  useEffect(() => {
    const refresh = () => setData(storage[collection]?.getAll() || []);
    refresh();
    return storage.subscribe(refresh);
  }, [collection]);

  const service = storage[collection];

  return {
    data,
    refresh: () => setData(service?.getAll() || []),
    create: (item) => service?.create(item),
    update: (id, item) => service?.update(id, item),
    remove: (id) => service?.delete(id),
    bulkRemove: (ids) => service?.bulkDelete(ids),
    getById: (id) => service?.getById(id),
    bulkCreate: (items) => service?.bulkCreate(items),
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState(() => storage.getDashboardStats());

  useEffect(() => {
    const refresh = () => setStats(storage.getDashboardStats());
    refresh();
    return storage.subscribe(refresh);
  }, []);

  return stats;
}

export default useLocalStorage;
