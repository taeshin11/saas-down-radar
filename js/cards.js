// Service card rendering
const CardRenderer = {
  container: null,
  t: null, // translations

  init(containerId) {
    this.container = document.getElementById(containerId);
  },

  setTranslations(t) {
    this.t = t;
  },

  getStatusClass(status) {
    return { operational: 'operational', degraded: 'degraded', partial: 'partial', major: 'major', unknown: 'unknown' }[status] || 'unknown';
  },

  getStatusText(status) {
    if (!this.t) return status;
    const map = {
      operational: this.t.operational,
      degraded: this.t.degraded,
      partial: this.t.partialOutage,
      major: this.t.majorOutageStatus,
      unknown: this.t.unknown
    };
    return map[status] || status;
  },

  getStatusIcon(status) {
    const icons = {
      operational: '<svg class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
      degraded: '<svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
      partial: '<svg class="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
      major: '<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
      unknown: '<svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>'
    };
    return icons[status] || icons.unknown;
  },

  formatTimeAgo(timestamp) {
    if (!timestamp) return '';
    const t = this.t || {};
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor(diff / 1000);
    if (mins > 0) return `${mins} ${t.agoMinutes || 'min ago'}`;
    if (secs > 10) return `${secs} ${t.agoSeconds || 'sec ago'}`;
    return t.justNow || 'just now';
  },

  renderSkeletons(count) {
    if (!this.container) return;
    this.container.innerHTML = Array(count).fill(
      '<div class="skeleton skeleton-card"></div>'
    ).join('');
  },

  renderCards(results, services) {
    if (!this.container) return;
    if (!results || results.length === 0) {
      this.container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400">
        <p class="text-lg">${this.t?.searchNoResults || 'No services found'}</p>
      </div>`;
      return;
    }

    this.container.innerHTML = results.map((result, index) => {
      const service = services.find(s => s.id === result.id) || {};
      const statusClass = this.getStatusClass(result.status);
      const cardClass = result.status === 'major' ? 'outage' :
                       ['degraded', 'partial'].includes(result.status) ? 'degraded-card' : '';
      const uptimePercent = result.uptime !== null ? result.uptime : '--';
      const uptimeWidth = result.uptime !== null ? result.uptime : 0;
      const uptimeLevel = uptimeWidth >= 99.5 ? 'high' : uptimeWidth >= 99 ? 'medium' : 'low';

      // Insert ad slot after every 8th card
      const adSlot = (index > 0 && index % 8 === 0) ?
        `<div class="col-span-full ad-slot" id="ad-between-rows-${index}">
          <div class="text-center p-4">Advertisement</div>
        </div>` : '';

      return `${adSlot}<div class="service-card ${cardClass} fade-in" data-service-id="${result.id}" onclick="App.toggleComponents('${result.id}')">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-lg font-bold text-gray-600 border border-gray-100">
              ${result.name.charAt(0)}
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 text-sm">${result.name}</h3>
              <p class="text-xs text-gray-400">${service.category || ''}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="status-dot ${statusClass}"></span>
          </div>
        </div>

        <div class="flex items-center gap-2 mb-2">
          ${this.getStatusIcon(result.status)}
          <span class="text-sm font-medium ${this.getStatusColorClass(result.status)}">${this.getStatusText(result.status)}</span>
        </div>

        <p class="text-xs text-gray-400 mb-3">
          ${this.t?.lastChecked || 'Last checked'}: ${this.formatTimeAgo(result.lastChecked)}
        </p>

        ${result.incidents && result.incidents.length > 0 ? `
          <div class="mb-2 p-2 bg-yellow-50 rounded-lg border border-yellow-100">
            <p class="text-xs text-yellow-700 font-medium truncate">${result.incidents[0].name}</p>
          </div>
        ` : ''}

        <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>${this.t?.uptime || 'Uptime'}</span>
          <span class="font-medium">${uptimePercent}%</span>
        </div>
        <div class="uptime-bar">
          <div class="uptime-fill ${uptimeLevel}" style="width: ${uptimeWidth}%"></div>
        </div>

        <div class="components-panel" id="components-${result.id}">
          ${result.components && result.components.length > 0 ? `
            <div class="mt-3 pt-3 border-t border-gray-100">
              <p class="text-xs font-semibold text-gray-500 mb-2">${this.t?.components || 'Components'}</p>
              ${result.components.slice(0, 8).map(c => `
                <div class="flex items-center justify-between py-1">
                  <span class="text-xs text-gray-600">${c.name}</span>
                  <span class="status-dot ${this.getStatusClass(c.status)}" style="width:8px;height:8px;"></span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          <a href="${service.url}" target="_blank" rel="noopener" class="block mt-2 text-xs text-blue-500 hover:text-blue-700">
            ${this.t?.viewStatus || 'View official status page'} &rarr;
          </a>
        </div>
      </div>`;
    }).join('');
  },

  getStatusColorClass(status) {
    return {
      operational: 'text-emerald-600',
      degraded: 'text-amber-600',
      partial: 'text-orange-600',
      major: 'text-red-600',
      unknown: 'text-gray-500'
    }[status] || 'text-gray-500';
  }
};
