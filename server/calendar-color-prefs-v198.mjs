import '../calendar-colors-v198.js';

// Display preferences are AiderLog data. Never PATCH Google's calendar metadata.
const colors = globalThis.AiderCalendarColorsV198;
const MAX_PREFERENCES = 500;
export function googleColorState(calendars, previous = {}, patch) {
  const ids = [...new Set((Array.isArray(calendars) ? calendars : []).map(row => String(row?.id || '')).filter(id => id && id.length <= 1024))].sort();
  const allowed = new Set(ids);
  const clean = value => Object.fromEntries(Object.entries(value && typeof value === 'object' && !Array.isArray(value) ? value : {})
    .filter(([id, color]) => allowed.has(id) && colors.sanitize(color)).slice(0, MAX_PREFERENCES).map(([id, color]) => [id, colors.sanitize(color)]));
  const overrides = clean(previous.calendarColorOverrides);
  if (patch !== undefined) {
    if (!patch || typeof patch !== 'object' || Array.isArray(patch) || Object.keys(patch).length > MAX_PREFERENCES) throw new Error('캘린더 색상 설정을 확인해주세요.');
    for (const [id, value] of Object.entries(patch)) {
      if (!allowed.has(id)) continue;
      if (value === '') delete overrides[id];
      else {
        const color = colors.sanitize(value);
        if (!color) throw new Error('캘린더 색상은 올바른 HEX 색상이어야 합니다.');
        Object.defineProperty(overrides, id, {value:color, writable:true, enumerable:true, configurable:true});
      }
    }
    if (Object.keys(overrides).length > MAX_PREFERENCES) throw new Error('저장할 캘린더 색상 설정이 너무 많습니다.');
  }
  const allocated = colors.allocate(ids, {overrides, automatic:clean(previous.calendarAutoColors)});
  return {colors:allocated.colors, calendarColorOverrides:overrides, calendarAutoColors:Object.fromEntries(Object.entries(allocated.automatic).slice(0, MAX_PREFERENCES))};
}

export function colorGoogleRows(rows, colorState) {
  return rows.map(row => {
    if (row?.externalSource !== 'google' || row.isHoliday || row.isBirthday) return row;
    const id = colors.googleId(row), color = id && colorState.colors[id];
    return color ? {...row, sourceColor:color, sourceColorVersion:198} : row;
  });
}
