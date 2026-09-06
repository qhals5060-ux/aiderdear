/* Reconcile one successful native command without replacing unrelated app data. */
(() => {
  'use strict';
  function mergeRow(privateData, currentUid, detail) {
    const {uid, payload, command, localBefore} = detail || {};
    if (!uid || uid !== currentUid || !privateData || !command || command.uid !== uid) return false;
    const field = command.op === 'routine' ? 'routines'
      : ['todo', 'add-todo', 'add-memo'].includes(command.op) ? 'checklists' : '';
    if (!field || !command.id || typeof localBefore !== 'string' || !Array.isArray(payload?.[field])) return false;
    const rows = Array.isArray(privateData[field]) ? privateData[field] : [];
    const index = rows.findIndex(row => String(row.id) === String(command.id));
    // A local edit made while the transaction was in flight wins this UI merge.
    // The verified widget cache still receives the complete server response.
    if (JSON.stringify(index < 0 ? null : rows[index]) !== localBefore) return false;
    const serverRow = payload[field].find(row => String(row.id) === String(command.id));
    if (!serverRow) return false;
    const safeRow = JSON.parse(JSON.stringify(serverRow));
    if (index < 0) rows.push(safeRow); else rows[index] = safeRow;
    privateData[field] = rows;
    return field;
  }
  window.AiderWidgetUIV165 = {mergeRow};
  window.addEventListener('aiderlog:widget-private-changed', event => {
    if (typeof P === 'undefined') return;
    const uid = window.AiderDearFirebase?.getState?.()?.user?.uid || '';
    const field = mergeRow(P, uid, event.detail);
    if (!field) return;
    // Never call savePrivate here: uploading the whole in-memory document could
    // overwrite another recent server edit. The transaction already saved it.
    if (field === 'checklists' && document.querySelector('#quickMemoModalV142.on')) {
      window.AiderLogNotepadV142?.refresh?.();
    }
    if (field === 'routines' && document.querySelector('#routine.on')
        && !document.querySelector('.overlay.on,dialog[open],#routine input:focus,#routine textarea:focus')) {
      window.renderRoutine?.();
    }
  });
})();
