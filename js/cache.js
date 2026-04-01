// localStorage caching for status data
const Cache = {
  PREFIX: 'sdr_',
  TTL: 5 * 60 * 1000, // 5 minutes

  set(key, data) {
    try {
      const item = { data, timestamp: Date.now() };
      localStorage.setItem(this.PREFIX + key, JSON.stringify(item));
    } catch (e) {
      console.warn('Cache write failed:', e);
    }
  },

  get(key) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      if (!raw) return null;
      const item = JSON.parse(raw);
      if (Date.now() - item.timestamp > this.TTL) {
        localStorage.removeItem(this.PREFIX + key);
        return null;
      }
      return item.data;
    } catch (e) {
      return null;
    }
  },

  getTimestamp(key) {
    try {
      const raw = localStorage.getItem(this.PREFIX + key);
      if (!raw) return null;
      return JSON.parse(raw).timestamp;
    } catch (e) {
      return null;
    }
  },

  clear() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(this.PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  }
};
