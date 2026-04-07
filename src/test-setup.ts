import '@testing-library/jest-dom'

// Node.js 25+ exposes a native `localStorage` global that lacks the full
// Web Storage API (e.g. `clear` is missing). Override it with a simple
// in-memory implementation so tests that call `localStorage.clear()` work
// regardless of whether jsdom has patched the global yet.
if (typeof globalThis.localStorage === 'undefined' || typeof globalThis.localStorage.clear !== 'function') {
  const store: Record<string, string> = {}
  const mockStorage: Storage = {
    get length() { return Object.keys(store).length },
    key(index: number) { return Object.keys(store)[index] ?? null },
    getItem(key: string) { return store[key] ?? null },
    setItem(key: string, value: string) { store[key] = String(value) },
    removeItem(key: string) { delete store[key] },
    clear() { Object.keys(store).forEach(k => { delete store[k] }) },
  }
  Object.defineProperty(globalThis, 'localStorage', { value: mockStorage, writable: true })
}
