// A lightweight, anonymous per-browser identity used only to optionally sync
// practice stats/history to the backend. There is no account/login system --
// this is purely a local random id persisted in localStorage.

const STORAGE_KEY = 'codeflow:deviceId';

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = window.localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
