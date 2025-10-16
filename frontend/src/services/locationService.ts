export interface Pos { lat: number; lng: number; timestamp?: number; }

const KEY = "driver_position";

export const saveDriverPosition = (pos: Pos) => {
  const payload = { ...pos, timestamp: Date.now() };
  localStorage.setItem(KEY, JSON.stringify(payload));
};

export const fetchDriverPosition = (): Pos | null => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Pos; } catch { return null; }
};
