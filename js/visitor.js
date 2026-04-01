// Visitor counter using localStorage (simple implementation)
const VisitorCounter = {
  init() {
    this.trackVisit();
    this.render();
  },

  trackVisit() {
    const today = new Date().toISOString().split('T')[0];
    const stored = JSON.parse(localStorage.getItem('sdr_visitors') || '{}');

    if (!stored.total) stored.total = 0;
    if (!stored.days) stored.days = {};

    // Check if this is a new session (not visited in last 30 min)
    const lastVisit = localStorage.getItem('sdr_last_visit');
    const now = Date.now();

    if (!lastVisit || now - parseInt(lastVisit) > 1800000) {
      stored.total += 1;
      stored.days[today] = (stored.days[today] || 0) + 1;
      localStorage.setItem('sdr_visitors', JSON.stringify(stored));
    }

    localStorage.setItem('sdr_last_visit', now.toString());

    // Clean old days (keep 30 days)
    const keys = Object.keys(stored.days).sort();
    if (keys.length > 30) {
      keys.slice(0, keys.length - 30).forEach(k => delete stored.days[k]);
      localStorage.setItem('sdr_visitors', JSON.stringify(stored));
    }
  },

  render() {
    const stored = JSON.parse(localStorage.getItem('sdr_visitors') || '{}');
    const today = new Date().toISOString().split('T')[0];
    const todayCount = stored.days?.[today] || 0;
    const totalCount = stored.total || 0;

    const todayEl = document.getElementById('visitors-today');
    const totalEl = document.getElementById('visitors-total');

    if (todayEl) todayEl.textContent = todayCount;
    if (totalEl) totalEl.textContent = totalCount;
  }
};
