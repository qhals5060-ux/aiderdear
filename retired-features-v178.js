/* Retire only the discontinued Language Lab's dedicated data and offline cache. */
(() => {
  'use strict';
  const fields = ['languageStudy', 'languageShorts', 'languageShortsV118'];
  const standaloneKey = key => /^(?:aiderlog-language-|languageProgress:)/.test(key);
  const assetPath = pathname => /\/(?:language-data-v2\/|(?:site-)?language(?:-lab|-content|-presentation|-v\d|-modern)[^/]*$)/.test(pathname);
  function cleanPrivate(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return data;
    for (const key of fields) delete data[key];
    return data;
  }
  function cleanLocal(storage) {
    if (!storage) return;
    const keys = Array.from({length: storage.length}, (_, i) => storage.key(i)).filter(Boolean);
    for (const key of keys) if (standaloneKey(key)) storage.removeItem(key);
    // This app cache is a private object, not an arbitrary export or clinical record.
    const key = 'aiderlog-private-v20', raw = storage.getItem(key);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || Array.isArray(data) || !fields.some(k => Object.hasOwn(data, k))) return;
      storage.setItem(key, JSON.stringify(cleanPrivate(data)));
    } catch { /* A malformed cache is preserved for recovery, never overwritten. */ }
  }
  async function cleanOffline(storage) {
    if (!storage?.keys) return;
    for (const name of await storage.keys()) {
      if (!/^aiderlog-/i.test(name)) continue;
      const cache = await storage.open(name);
      for (const request of await cache.keys()) {
        const url = new URL(request.url);
        if (url.origin === location.origin && assetPath(url.pathname)) await cache.delete(request);
      }
    }
  }
  window.AiderLogRetiredFeaturesV178 = Object.freeze({cleanPrivate, cleanLocal, cleanOffline, standaloneKey, assetPath});
  try { cleanLocal(localStorage); } catch { /* Storage can be disabled in a browser. */ }
  cleanOffline(window.caches).catch(() => {});
})();
