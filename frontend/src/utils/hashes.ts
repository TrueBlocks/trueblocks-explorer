const _displayHashCache = new Map<string, string>();

export const displayHash = (v: unknown): string => {
  try {
    if (!v) return '';
    if (typeof v === 'string') {
      const s = v.startsWith('0x') ? v : `0x${v}`;
      const cached = _displayHashCache.get(s);
      if (cached) return cached;
      const out = s.length <= 18 ? s : `${s.slice(0, 10)}…${s.slice(-8)}`;
      _displayHashCache.set(s, out);
      if (_displayHashCache.size > 1000) {
        const firstKey = _displayHashCache.keys().next().value;
        if (firstKey) _displayHashCache.delete(firstKey);
      }
      return out;
    }
    const obj = v as { hash?: number[] };
    const arr = obj && Array.isArray(obj.hash) ? obj.hash : undefined;
    if (arr && arr.length > 0) {
      const hex = `0x${arr.map((b) => b.toString(16).padStart(2, '0')).join('')}`;
      if (hex.length <= 18) return hex;
      return `${hex.slice(0, 10)}…${hex.slice(-8)}`;
    }
    const s = String(v);
    if (s.length <= 18) return s;
    return `${s.slice(0, 10)}…${s.slice(-8)}`;
  } catch {
    return String(v || '');
  }
};
