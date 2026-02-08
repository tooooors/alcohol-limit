import { ref, computed, watch } from 'vue';
import type { StoredData } from '../types';

const STORAGE_KEY = 'alcohol-limit-data';

function getTodayString(): string {
  const iso = new Date().toISOString();
  return iso.slice(0, 10);
}

function loadFromStorage(): StoredData | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredData;
  } catch {
    return null;
  }
}

function saveToStorage(data: StoredData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useDrinkTracker() {
  const today = getTodayString();
  const stored = loadFromStorage();

  // 日付が変わっていたらリセット
  const initialData: StoredData =
    stored && stored.date === today
      ? stored
      : { date: today, limit: 3, count: 0 };

  const limit = ref(initialData.limit);
  const count = ref(initialData.count);

  const isOverLimit = computed(() => count.value >= limit.value);

  // 状態変更時に自動保存
  watch(
    [limit, count],
    () => {
      saveToStorage({
        date: today,
        limit: limit.value,
        count: count.value,
      });
    },
    { immediate: true }
  );

  function setLimit(n: number) {
    if (n >= 1) {
      limit.value = n;
    }
  }

  function drink() {
    count.value++;
  }

  function reset() {
    count.value = 0;
  }

  return {
    limit,
    count,
    isOverLimit,
    setLimit,
    drink,
    reset,
  };
}
