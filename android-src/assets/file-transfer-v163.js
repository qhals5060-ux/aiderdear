/* Android only: preserve local Blobs until a system document-picker export completes. */
(() => {
  'use strict';
  if (!window.AiderLogFiles) return;
  const bridge = window.AiderLogFiles;
  const blobs = new Map();
  const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
  URL.createObjectURL = blob => { const url = create(blob); blobs.set(url, blob); return url; };
  URL.revokeObjectURL = url => { blobs.delete(String(url)); return revoke(url); };
  let busy = false;
  const extension = { 'application/pdf': 'pdf', 'application/json': 'json', 'text/plain': 'txt', 'text/csv': 'csv', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'video/mp4': 'mp4', 'video/webm': 'webm', 'audio/webm': 'webm', 'audio/mpeg': 'mp3', 'application/zip': 'zip' };
  const readChunk = blob => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    reader.readAsDataURL(blob);
  });
  function status(text, error = false) {
    let el = document.getElementById('fileTransferStatusV163');
    if (!el) {
      el = document.createElement('div'); el.id = 'fileTransferStatusV163';
      el.setAttribute('role', 'status'); document.body.append(el);
    }
    el.textContent = text; el.hidden = false;
    clearTimeout(status.timer);
    status.timer = setTimeout(() => { el.hidden = true; }, error ? 7000 : 3500);
  }
  async function saveUrl(url, name = '', type = '') {
    // Capture synchronously: existing exporters revoke their object URL immediately after click.
    const retained = blobs.get(String(url));
    if (busy) { status('현재 파일의 저장 준비가 끝난 뒤 다시 눌러주세요.'); return false; }
    busy = true; let id = '';
    try {
      let blob = retained;
      if (!blob) {
        status('파일을 불러오는 중…');
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) throw new Error('파일을 불러오지 못했습니다. 연결과 접근 권한을 확인해주세요.');
        if (!name) {
          const disposition = response.headers.get('content-disposition') || '';
          const utf = disposition.match(/filename\*=UTF-8''([^;]+)/i);
          const plain = disposition.match(/filename="?([^";]+)/i);
          name = utf ? decodeURIComponent(utf[1]) : plain ? plain[1] : '';
        }
        blob = await response.blob();
      }
      if (blob.size > 256 * 1024 * 1024) throw new Error('한 번에 저장할 수 있는 파일은 256 MB까지입니다.');
      type = blob.type || type || 'application/octet-stream';
      if (!name && /^https?:/.test(url)) name = decodeURIComponent(new URL(url).pathname.split('/').pop() || '');
      name = name || 'AiderLog-' + new Date().toISOString().slice(0, 10);
      if (!/\.[a-z0-9]{1,8}$/i.test(name) && extension[type]) name += '.' + extension[type];
      id = bridge.beginFile(name, type);
      if (!id) throw new Error('열려 있는 파일 저장창을 완료하거나 취소한 뒤 다시 시도해주세요.');
      const chunkSize = 192 * 1024;
      for (let offset = 0; offset < blob.size; offset += chunkSize) {
        if (!bridge.appendFile(id, await readChunk(blob.slice(offset, offset + chunkSize)))) throw new Error('파일 저장 준비에 실패했습니다. 저장 공간을 확인해주세요.');
        status('저장 준비 ' + Math.min(100, Math.round((offset + chunkSize) / blob.size * 100)) + '%');
      }
      if (!bridge.finishFile(id)) throw new Error('저장 위치 선택창을 열지 못했습니다.');
      status('시스템 파일 창에서 저장할 위치를 선택해주세요.');
      return true;
    } catch (error) {
      if (id) bridge.cancelFile(id);
      status(error.message || '파일 저장에 실패했습니다.', true);
      return false;
    } finally { busy = false; }
  }
  function preview(url, name = '') {
    const blob = blobs.get(String(url));
    if (!blob || !/^(image|video|audio)\//.test(blob.type)) { void saveUrl(url, name); return; }
    const localUrl = create(blob);
    const shell = document.createElement('section'); shell.className = 'file-viewer-v163';
    shell.setAttribute('role', 'dialog'); shell.setAttribute('aria-modal', 'true'); shell.setAttribute('aria-label', '첨부파일');
    const head = document.createElement('header');
    const title = document.createElement('strong'); title.textContent = name || '첨부파일';
    const close = document.createElement('button'); close.type = 'button'; close.textContent = '닫기';
    const save = document.createElement('button'); save.type = 'button'; save.textContent = '기기에 저장';
    const media = document.createElement(blob.type.startsWith('image/') ? 'img' : blob.type.startsWith('video/') ? 'video' : 'audio');
    media.src = localUrl; if (media.tagName !== 'IMG') media.controls = true; else media.alt = name || '첨부 이미지';
    const previous = document.activeElement;
    const dismiss = () => { shell.remove(); revoke(localUrl); blobs.delete(localUrl); previous?.focus?.({ preventScroll: true }); };
    close.onclick = dismiss; shell.onkeydown = e => { if (e.key === 'Escape') dismiss(); };
    save.onclick = () => { blobs.set(localUrl, blob); void saveUrl(localUrl, name); };
    head.append(title, save, close); shell.append(head, media); document.body.append(shell); close.focus();
  }
  const anchorClick = HTMLAnchorElement.prototype.click;
  function handle(anchor) {
    if (!anchor?.href) return false;
    const local = /^(blob:|data:)/.test(anchor.href);
    if (anchor.hasAttribute('download') || local) {
      if (anchor.hasAttribute('download')) void saveUrl(anchor.href, anchor.download);
      else preview(anchor.href);
      return true;
    }
    return false;
  }
  HTMLAnchorElement.prototype.click = function () { if (!handle(this)) return anchorClick.call(this); };
  const open = window.open.bind(window);
  window.open = function (url, ...args) { if (/^(blob:|data:)/.test(String(url))) { preview(String(url)); return null; } return open(url, ...args); };
  const mime = { '.pdf': 'application/pdf', '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', '.json': 'application/json', '.txt': 'text/plain', '.csv': 'text/csv', '.zip': 'application/zip', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4', '.mov': 'video/quicktime' };
  function normalize(input) {
    if (input?.type !== 'file' || !input.accept) return;
    input.accept = [...new Set(input.accept.split(',').map(t => mime[t.trim().toLowerCase()] || t.trim()))].join(',');
  }
  const inputClick = HTMLInputElement.prototype.click;
  HTMLInputElement.prototype.click = function () { normalize(this); return inputClick.call(this); };
  document.addEventListener('click', event => {
    normalize(event.target);
    const anchor = event.target.closest?.('a');
    if (handle(anchor)) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  window.AiderLogFileIO = Object.freeze({ saveUrl, preview });
})();
