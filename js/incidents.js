// Incident history rendering
const IncidentFeed = {
  container: null,
  t: null,

  init(containerId) {
    this.container = document.getElementById(containerId);
  },

  setTranslations(t) {
    this.t = t;
  },

  render(incidents) {
    if (!this.container) return;

    if (!incidents || incidents.length === 0) {
      this.container.innerHTML = `
        <div class="text-center py-8 text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p>${this.t?.noIncidents || 'No recent incidents reported'}</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = incidents.map(inc => {
      const impactClass = inc.impact === 'critical' || inc.impact === 'major' ? 'major' :
                          inc.status === 'resolved' ? 'resolved' : '';
      const timeStr = this.formatDate(inc.createdAt);

      return `
        <div class="incident-item ${impactClass}">
          <div class="flex items-start justify-between mb-1">
            <div>
              <span class="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">${inc.serviceName}</span>
              <h4 class="text-sm font-medium text-gray-800 mt-1">${inc.name}</h4>
            </div>
            <span class="text-xs text-gray-400 whitespace-nowrap ml-2">${timeStr}</span>
          </div>
          ${inc.updates && inc.updates[0] ? `
            <p class="text-xs text-gray-500 mt-1">${inc.updates[0].body.substring(0, 200)}${inc.updates[0].body.length > 200 ? '...' : ''}</p>
          ` : ''}
          <div class="mt-1">
            <span class="text-xs font-medium ${this.getImpactColor(inc.impact)}">${inc.status || inc.impact}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now - d;
      const diffH = Math.floor(diffMs / 3600000);
      const diffD = Math.floor(diffMs / 86400000);

      if (diffH < 1) return this.t?.justNow || 'just now';
      if (diffH < 24) return `${diffH}h ago`;
      if (diffD < 7) return `${diffD}d ago`;
      return d.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  },

  getImpactColor(impact) {
    const colors = {
      none: 'text-emerald-600',
      minor: 'text-amber-600',
      major: 'text-red-600',
      critical: 'text-red-700'
    };
    return colors[impact] || 'text-gray-500';
  }
};
