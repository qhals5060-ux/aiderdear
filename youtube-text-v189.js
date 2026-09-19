/* Shared, local-only YouTube URL and subtitle text normalization. No network,
   translation, evaluation or HTML rendering occurs in this module. */
export const YOUTUBE_TEXT_LIMIT = 32000;
export const YOUTUBE_SENTENCE_LIMIT = 200;
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

function fail(code, message) {
  const error = new Error(message); error.code = code; throw error;
}

export function normalizeYoutubeURL(input) {
  if (typeof input !== 'string' || input.length > 2048) fail('invalid_url', 'YouTube 영상 주소를 입력해주세요.');
  let raw = input.trim();
  if (/^(?:www\.|m\.)?youtube\.com\//i.test(raw) || /^youtu\.be\//i.test(raw)) raw = 'https://' + raw;
  let parsed;
  try { parsed = new URL(raw); } catch { fail('invalid_url', '올바른 YouTube 영상 주소가 아닙니다.'); }
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.port)
    fail('invalid_url', 'YouTube 영상 주소만 사용할 수 있습니다.');
  const host = parsed.hostname.toLowerCase();
  let videoId = '';
  if (host === 'youtu.be') {
    const match = parsed.pathname.match(/^\/([A-Za-z0-9_-]{11})\/?$/); videoId = match?.[1] || '';
  } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
    if (parsed.pathname === '/watch' && parsed.searchParams.getAll('v').length === 1) videoId = parsed.searchParams.get('v');
    else videoId = parsed.pathname.match(/^\/(?:shorts|embed)\/([A-Za-z0-9_-]{11})\/?$/)?.[1] || '';
  }
  if (!VIDEO_ID.test(videoId)) fail('invalid_url', 'YouTube 영상의 watch, Shorts, 공유 또는 embed 주소를 입력해주세요.');
  return { videoId, url: `https://www.youtube.com/watch?v=${videoId}` };
}

export function decodeCaptionEntities(text) {
  return String(text).replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, key) => {
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
    if (key[0] !== '#') return named[key.toLowerCase()] ?? match;
    const value = key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1));
    return value > 0 && value <= 0x10ffff && !(value >= 0xd800 && value <= 0xdfff) ? String.fromCodePoint(value) : match;
  });
}

function cleanText(value) {
  return String(value).replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .split('\n').map(line => line.replace(/[\t \u00a0]+/g, ' ').trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function subtitleText(value) {
  // Remove only subtitle presentation tags. Other text, including angle brackets,
  // remains ordinary text and must be rendered with textContent by the caller.
  return cleanText(decodeCaptionEntities(String(value).replace(/<\/?(?:c(?:\.[^\s<>]+)?|v(?:\s[^<>]*)?|lang(?:\s[^<>]*)?|b|i|u|ruby|rt)>/gi, '').replace(/<\d{1,2}:\d{2}(?::\d{2})?\.\d{3}>/g, '')));
}

function timeValue(value) {
  const parts = value.replace(',', '.').split(':').map(Number);
  if (parts.length < 2 || parts.length > 3 || parts.some(n => !Number.isFinite(n) || n < 0)
      || parts.at(-1) >= 60 || (parts.length === 3 && parts[1] >= 60)) fail('invalid_text', '자막의 시간 형식을 확인해주세요.');
  const time = parts.reduce((a, n) => a * 60 + n, 0);
  if (time > 86400) fail('invalid_text', '자막 시간은 24시간 이내여야 합니다.');
  return time;
}

function overlapText(previous, current) {
  if (previous === current) return '';
  if (current.startsWith(previous) && /[\s,.;!?。！？]/.test(current[previous.length] || ' ')) return current.slice(previous.length).trimStart();
  // Match complete words only. A temporal overlap is required by the caller, and
  // at least two words avoids deleting a naturally repeated short word.
  const left = previous.split(/\s+/), right = [...current.matchAll(/\S+/g)];
  const word = token => token.replace(/[.,!?…。！？]+$/, '');
  for (let n = Math.min(left.length, right.length); n >= 2; n--) {
    const suffix = left.slice(-n);
    if (!suffix.every((token, i) => i === n - 1 ? word(token) === word(right[i][0]) : token === right[i][0])) continue;
    const last = right[n - 1], oldLast = suffix[n - 1];
    const punctuation = last[0].startsWith(oldLast) ? last[0].slice(oldLast.length) : '';
    return (punctuation + current.slice(last.index + last[0].length)).trimStart();
  }
  return current;
}

export function organizeSegments(input) {
  if (!Array.isArray(input) || input.length > 4000) fail('invalid_text', '자막 항목은 4,000개 이내여야 합니다.');
  let size = 0;
  const rows = input.map((row, index) => {
    if (!row || typeof row.text !== 'string') fail('invalid_text', '자막 본문을 확인해주세요.');
    size += row.text.length;
    if (size > YOUTUBE_TEXT_LIMIT) fail('too_long', '본문은 32,000자 이내로 나누어 입력해주세요.');
    const start = row.start === null || row.start === undefined ? null : Number(row.start);
    const end = row.end != null ? Number(row.end) : row.duration != null && start !== null ? start + Number(row.duration) : null;
    if (start !== null && (!Number.isFinite(start) || start < 0 || start > 86400)
        || end !== null && (!Number.isFinite(end) || end < (start ?? 0) || end > 86400)) fail('invalid_text', '자막의 시간 범위를 확인해주세요.');
    return { start, end, text: cleanText(row.text), index };
  }).filter(row => row.text);
  if (rows.every(row => row.start !== null)) rows.sort((a, b) => a.start - b.start || a.index - b.index);
  const segments = [];
  let previous = null;
  for (const row of rows) {
    let text = row.text;
    if (previous && row.start !== null && previous.start !== null
        && (row.start === previous.start || previous.end !== null && row.start < previous.end)
        && !previous.text.includes('\n') && !text.includes('\n')) text = overlapText(previous.text, text);
    if (text) segments.push({ start: row.start, text });
    previous = row;
  }
  let stream = ''; const offsets = [];
  for (const row of segments) {
    if (stream && !/^[,.;!?。！？]/.test(row.text)) stream += ' ';
    offsets.push({ offset: stream.length, start: row.start }); stream += row.text;
  }
  const sentences = [];
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'sentence' }) : null;
  let paragraphOffset = 0;
  for (const paragraph of stream.split('\n')) {
    const pieces = segmenter ? [...segmenter.segment(paragraph)].map(item => ({ text: item.segment, index: item.index }))
      : [...paragraph.matchAll(/[^.!?。！？]+(?:[.!?。！？]+["'”’)]*|$)/g)].map(match => ({ text: match[0], index: match.index }));
    for (const piece of pieces) {
      const text = piece.text.trim(); if (!text) continue;
      const first = paragraphOffset + piece.index + piece.text.search(/\S/);
      let owner = offsets[0]; for (const item of offsets) { if (item.offset > first) break; owner = item; }
      sentences.push({ start: owner?.start ?? null, text });
      if (sentences.length > YOUTUBE_SENTENCE_LIMIT) fail('too_many_sentences', '문장이 200개를 넘습니다. 구간을 나누어 입력해주세요.');
    }
    paragraphOffset += paragraph.length + 1;
  }
  return { segments, sentences };
}

export function organizeText(input) {
  if (typeof input !== 'string' || !input.trim()) fail('invalid_text', '자막이나 원문을 입력해주세요.');
  if (input.length > YOUTUBE_TEXT_LIMIT) fail('too_long', '본문은 32,000자 이내로 나누어 입력해주세요.');
  const lines = input.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  const timePattern = '(?:\\d{1,2}:)?\\d{1,2}:\\d{2}(?:[.,]\\d{1,3})?';
  const cue = new RegExp(`^\\s*(${timePattern})\\s*-->\\s*(${timePattern})(?:\\s.*)?$`);
  const stamped = new RegExp(`^\\s*\\[?(${timePattern})\\]?\\s+(.+)$`);
  const hasCues = lines.some(line => cue.test(line));
  if (hasCues) {
    const rows = []; let current = null, ignore = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i], match = line.match(cue);
      if (match) { current = { start: timeValue(match[1]), end: timeValue(match[2]), text: '' }; rows.push(current); ignore = false; continue; }
      if (!line.trim()) { current = null; ignore = false; continue; }
      if (/^(?:WEBVTT(?:\s.*)?|NOTE(?:\s.*)?|STYLE|REGION)$/.test(line.trim())) { ignore = true; current = null; continue; }
      if (ignore || !current) continue;
      current.text += (current.text ? '\n' : '') + line;
    }
    const organized = organizeSegments(rows.map(row => ({ ...row, text: subtitleText(row.text) })));
    if (!organized.sentences.length) fail('invalid_text', '자막 본문이 비어 있습니다. 원문이 포함된 자막을 입력해주세요.');
    return organized;
  }
  if (/^WEBVTT(?:\s|$)/.test(lines[0])) fail('invalid_text', '시간과 본문이 포함된 VTT 자막을 입력해주세요.');
  const rows = []; let current = null;
  if (lines.some(line => stamped.test(line))) {
    for (const line of lines) {
      const match = line.match(stamped);
      if (match) { current = { start: timeValue(match[1]), text: match[2] }; rows.push(current); }
      else if (line.trim()) { if (current) current.text += '\n' + line; else rows.push({ start: null, text: line }); }
    }
    return organizeSegments(rows);
  }
  return organizeSegments([{ start: null, text: input }]);
}
