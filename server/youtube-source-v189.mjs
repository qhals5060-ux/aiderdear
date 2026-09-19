import { normalizeYoutubeURL, organizeSegments, decodeCaptionEntities } from '../youtube-text-v189.js';

const WATCH_LIMIT = 2 * 1024 * 1024;
const CAPTION_LIMIT = 512 * 1024;
const META_LIMIT = 64 * 1024;
const TIMEOUT_MS = 10000;

class SourceError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

function textValue(value, limit = 300) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, limit) : '';
}

export function extractPlayerResponse(html) {
  if (typeof html !== 'string' || html.length > WATCH_LIMIT) return null;
  const assignments = /(?:\b(?:var|let|const)\s+)?\bytInitialPlayerResponse\s*=\s*|["']ytInitialPlayerResponse["']\s*:\s*/g;
  let match;
  while ((match = assignments.exec(html))) {
    const start = assignments.lastIndex;
    if (html[start] !== '{') continue;
    let depth = 0, quoted = false, escaped = false;
    for (let i = start; i < html.length; i++) {
      const char = html[i];
      if (quoted) { if (escaped) escaped = false; else if (char === '\\') escaped = true; else if (char === '"') quoted = false; continue; }
      if (char === '"') quoted = true;
      else if (char === '{') depth++;
      else if (char === '}' && --depth === 0) {
        try { const value = JSON.parse(html.slice(start, i + 1)); if (value && typeof value === 'object' && !Array.isArray(value)) return value; } catch { /* This is data, never executable JavaScript. */ }
        break;
      }
    }
  }
  return null;
}

export function parseCaptionJSON(body) {
  const data = JSON.parse(body);
  if (!data || !Array.isArray(data.events)) return [];
  return data.events.flatMap(event => {
    if (!Array.isArray(event?.segs) || event.tStartMs == null) return [];
    const text = event.segs.map(segment => typeof segment?.utf8 === 'string' ? segment.utf8 : '').join('');
    if (!text.trim()) return [];
    const start = Number(event.tStartMs) / 1000;
    const end = event.dDurationMs != null ? start + Number(event.dDurationMs) / 1000 : undefined;
    return [{ start, ...(end !== undefined ? { end } : {}), text: decodeCaptionEntities(text) }];
  });
}

function attribute(attrs, name) {
  const match = attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`));
  return match?.[1] ?? match?.[2] ?? null;
}

export function parseCaptionXML(body) {
  // Public timedtext XML only; no DOM parser, entities, DTD or external resources.
  if (/<!DOCTYPE|<!ENTITY/i.test(body)) throw new SourceError('caption_format', '지원하지 않는 자막 형식입니다.');
  if (!/^\s*(?:<\?xml[^>]*>\s*)?<(?:transcript|timedtext)\b/i.test(body)) return [];
  const rows = [];
  for (const match of body.matchAll(/<(text|p)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi)) {
    const ms = match[1].toLowerCase() === 'p', rawStart = attribute(match[2], ms ? 't' : 'start');
    if (rawStart === null || !/^\d+(?:\.\d+)?$/.test(rawStart)) continue;
    const rawDuration = attribute(match[2], ms ? 'd' : 'dur'), start = Number(rawStart) / (ms ? 1000 : 1);
    const end = rawDuration !== null && /^\d+(?:\.\d+)?$/.test(rawDuration) ? start + Number(rawDuration) / (ms ? 1000 : 1) : undefined;
    const text = decodeCaptionEntities(match[3].replace(/<br\s*\/?\s*>/gi, '\n').replace(/<[^>]*>/g, ''));
    if (text.trim()) rows.push({ start, ...(end !== undefined ? { end } : {}), text });
  }
  return rows;
}

function captionURL(track) {
  if (typeof track?.baseUrl !== 'string' || track.baseUrl.length > 16000) return null;
  try {
    const url = new URL(track.baseUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'www.youtube.com' || url.port || url.username || url.password
        || url.pathname !== '/api/timedtext' || url.hash) return null;
    return url;
  } catch { return null; }
}

function aborted(signal) {
  if (signal.aborted) throw new SourceError('timeout', '영상 정보를 불러오는 시간이 초과되었습니다.');
}

async function abortable(promise, signal) {
  aborted(signal);
  let onAbort;
  const stopped = new Promise((_, reject) => { onAbort = () => reject(new SourceError('timeout', '영상 정보를 불러오는 시간이 초과되었습니다.')); signal.addEventListener('abort', onAbort, { once: true }); });
  try { return await Promise.race([promise, stopped]); } finally { signal.removeEventListener('abort', onAbort); }
}

async function boundedFetch(fetchImpl, url, limit, signal, accept) {
  aborted(signal);
  const response = await abortable(fetchImpl(String(url), {
    method: 'GET', redirect: 'manual', signal, credentials: 'omit',
    headers: { Accept: accept, 'Accept-Language': 'en,ko;q=0.8' },
  }), signal);
  aborted(signal);
  if (response.status >= 300 && response.status < 400) { await response.body?.cancel?.(); throw new SourceError('redirect', '공개 자막 주소가 다른 곳으로 이동했습니다.'); }
  if (!response.ok) { await response.body?.cancel?.(); throw new SourceError(response.status === 404 ? 'not_found' : 'blocked', 'YouTube에서 공개 정보 요청을 허용하지 않았습니다.'); }
  const length = Number(response.headers?.get?.('content-length'));
  if (length > limit) { await response.body?.cancel?.(); throw new SourceError('too_large', '응답이 너무 큽니다. 필요한 자막 구간을 직접 입력해주세요.'); }
  if (!response.body?.getReader) throw new SourceError('invalid_response', '영상 정보 응답을 읽을 수 없습니다.');
  const reader = response.body.getReader(), decoder = new TextDecoder(); let size = 0, body = '';
  try {
    while (true) {
      aborted(signal);
      const { done, value } = await abortable(reader.read(), signal);
      if (done) break;
      size += value.byteLength;
      if (size > limit) { await reader.cancel(); throw new SourceError('too_large', '응답이 너무 큽니다. 필요한 자막 구간을 직접 입력해주세요.'); }
      body += decoder.decode(value, { stream: true });
    }
    return body + decoder.decode();
  } finally { if (signal.aborted) reader.cancel().catch(() => {}); reader.releaseLock(); }
}

function reasonFor(error) {
  if (['too_long', 'too_many_sentences', 'too_large'].includes(error?.code)) return error.message;
  if (error?.code === 'timeout' || error?.name === 'AbortError' || error?.name === 'TimeoutError') return '자동 가져오기 시간이 초과되었습니다. 자막이나 원문을 직접 입력해주세요.';
  return 'YouTube에서 공개 자막을 가져올 수 없습니다. 자막이나 원문을 직접 입력해주세요.';
}

export async function importVideo(input, { fetchImpl = globalThis.fetch, signal } = {}) {
  const normalized = normalizeYoutubeURL(input);
  if (typeof fetchImpl !== 'function') throw new TypeError('fetchImpl must be a function');
  const result = { ...normalized, title: '', thumbnail: `https://i.ytimg.com/vi/${normalized.videoId}/hqdefault.jpg`, author: '', captionStatus: 'unavailable', language: '', segments: [], sentences: [] };
  const controller = new AbortController(), abort = () => controller.abort(signal?.reason);
  if (signal?.aborted) abort(); else signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS); timer.unref?.();
  let player = null;
  try {
    const html = await boundedFetch(fetchImpl, normalized.url, WATCH_LIMIT, controller.signal, 'text/html');
    player = extractPlayerResponse(html);
    if (player?.videoDetails?.videoId && player.videoDetails.videoId !== normalized.videoId) throw new SourceError('invalid_response', '영상 정보가 일치하지 않습니다.');
    result.title = textValue(player?.videoDetails?.title, 500);
    result.author = textValue(player?.videoDetails?.author, 200);
    const status = player?.playabilityStatus?.status;
    if (status && status !== 'OK') { result.captionStatus = 'blocked'; result.reason = '공개 상태로 접근할 수 없는 영상입니다. 자막이나 원문을 직접 입력해주세요.'; }
    else if (!player) { result.captionStatus = 'blocked'; result.reason = 'YouTube 공개 페이지에서 자막 정보를 확인할 수 없습니다. 원문을 직접 입력해주세요.'; }
    else {
      const tracks = player?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      const safeTracks = (Array.isArray(tracks) ? tracks : []).map(track => ({ track, url: captionURL(track) }))
        .filter(row => row.url && (!row.url.searchParams.has('v') || row.url.searchParams.get('v') === normalized.videoId));
      const score = row => (String(row.track.languageCode || '').split('-')[0] === 'en' ? 0 : String(row.track.languageCode || '').split('-')[0] === 'ko' ? 2 : 4) + (row.track.kind === 'asr' ? 1 : 0);
      safeTracks.sort((a, b) => score(a) - score(b));
      const selected = safeTracks[0];
      if (!selected) { result.reason = '이 영상에서 가져올 수 있는 공개 자막이 없습니다. 원문을 직접 입력해주세요.'; }
      else {
        result.language = textValue(selected.track.languageCode, 35);
        const jsonURL = new URL(selected.url); jsonURL.searchParams.set('fmt', 'json3');
        const body = await boundedFetch(fetchImpl, jsonURL, CAPTION_LIMIT, controller.signal, 'application/json,text/plain');
        let rows;
        try { rows = parseCaptionJSON(body); } catch { rows = []; }
        if (!rows.length) {
          const xmlURL = new URL(selected.url); xmlURL.searchParams.delete('fmt');
          rows = parseCaptionXML(await boundedFetch(fetchImpl, xmlURL, CAPTION_LIMIT, controller.signal, 'text/xml,application/xml,text/plain'));
        }
        if (rows.length) {
          const organized = organizeSegments(rows);
          if (organized.sentences.length) { Object.assign(result, organized); result.captionStatus = 'ready'; }
        }
        if (result.captionStatus !== 'ready') { result.captionStatus = 'blocked'; result.reason = 'YouTube가 자막 본문을 제공하지 않았습니다. 자막이나 원문을 직접 입력해주세요.'; }
      }
    }
  } catch (error) {
    result.captionStatus = error?.code === 'not_found' ? 'unavailable' : 'blocked'; result.reason = reasonFor(error);
  }
  try {
    if (!result.title && !controller.signal.aborted) {
      const url = new URL('https://www.youtube.com/oembed'); url.searchParams.set('url', normalized.url); url.searchParams.set('format', 'json');
      const metadata = JSON.parse(await boundedFetch(fetchImpl, url, META_LIMIT, controller.signal, 'application/json'));
      result.title = textValue(metadata?.title, 500); result.author = textValue(metadata?.author_name, 200);
    }
  } catch { /* Caption status remains honest even when optional metadata fails. */ }
  finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
  return result;
}
