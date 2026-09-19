/* Retired tools stay hidden; user records remain stored. Only cached app assets are retired. */
(() => {
  'use strict';
  const fields = ['languageStudy', 'languageShorts', 'languageShortsV118'];
  const standaloneKey = key => /^(?:aiderlog-language-|languageProgress:)/.test(key);
  const assetPath = pathname => /\/(?:language-data-v2\/|(?:site-)?language(?:-lab|-content|-presentation|-v\d|-modern)[^/]*$)/.test(pathname);
  function cleanPrivate(data) { return data; }
  function cleanLocal() { /* User-created records are never cache cleanup targets. */ }
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
