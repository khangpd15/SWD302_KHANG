export const PREFIX = 'swd-study-v1-';

export function load(key, fallback, validate = () => true) {
  try {
    const value = JSON.parse(localStorage.getItem(PREFIX + key));
    if (value != null && validate(value)) return value;
  } catch { /* Missing, corrupt, or unavailable storage uses the default. */ }
  return typeof fallback === 'function' ? fallback() : fallback;
}

export function persist(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch { return false; }
}

export function validSession(value, questionMap) {
  return value && Array.isArray(value.ids) && value.ids.length > 0 &&
    value.ids.every(id => questionMap.has(id)) && new Set(value.ids).size === value.ids.length &&
    value.answers && typeof value.answers === 'object' && !Array.isArray(value.answers) &&
    Object.values(value.answers).every(a => Number.isInteger(a) && a >= 0 && a < 4) &&
    Array.isArray(value.flags) && Number.isInteger(value.index) && value.index >= 0 && value.index < value.ids.length &&
    ['exam', 'practice'].includes(value.kind) && Number.isFinite(value.startedAt) &&
    (value.deadline === null || Number.isFinite(value.deadline));
}
