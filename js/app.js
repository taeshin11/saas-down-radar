// Main application logic
const App = {
  refreshInterval: null,
  currentFilter: 'All',
  currentSearch: '',

  async init() {
    // Load translations and detect language
    await I18n.load();
    I18n.detectLanguage();
    const t = I18n.getAll();

    // Initialize modules
    StatusChecker.init();
    CardRenderer.init('service-grid');
    CardRenderer.setTranslations(t);
    IncidentFeed.init('incident-feed');
    IncidentFeed.setTranslations(t);
    SheetsWebhook.init();

    // Apply translations to UI
    this.applyTranslations(t);

    // Initialize language selector
    this.initLanguageSelector();

    // Show loading skeletons
    CardRenderer.renderSkeletons(20);

    // Load services and fetch status
    await ServiceManager.load();
    await this.refreshStatus();

    // Initialize search
    Search.init('search-input', (query) => {
      this.currentSearch = query;
      this.filterAndRender();
    });
    Search.setPlaceholder(t.searchPlaceholder);

    // Initialize category filters
    this.initFilters();

    // Auto-refresh every 5 minutes
    this.refreshInterval = setInterval(() => this.refreshStatus(), 5 * 60 * 1000);

    // Visitor counter
    VisitorCounter.init();

    // Ads
    AdManager.init();

    // Log visit
    SheetsWebhook.log('page_visit', '/');

    // Social share buttons
    this.initShareButtons();

    // Update refresh timer display
    this.startRefreshTimer();
  },

  async refreshStatus() {
    const refreshIndicator = document.getElementById('refresh-indicator');
    if (refreshIndicator) refreshIndicator.classList.remove('hidden');

    await StatusChecker.fetchAll(ServiceManager.services);

    if (refreshIndicator) refreshIndicator.classList.add('hidden');

    this.filterAndRender();
    this.updateSummary();
    this.renderIncidents();
    this.updateOutageBanner();
    this.updateDynamicMeta();
    this.lastRefreshTime = Date.now();
  },

  filterAndRender() {
    let services = ServiceManager.getByCategory(this.currentFilter);
    if (this.currentSearch) {
      const searchResults = ServiceManager.search(this.currentSearch);
      services = services.filter(s => searchResults.find(sr => sr.id === s.id));
    }

    const results = services.map(s => StatusChecker.results[s.id]).filter(Boolean);
    CardRenderer.renderCards(results, ServiceManager.services);
  },

  updateSummary() {
    const summary = StatusChecker.getSummary();
    const t = I18n.getAll();

    const summaryEl = document.getElementById('status-summary');
    const countEl = document.getElementById('status-counts');

    if (summaryEl) {
      let text, cssClass;
      if (summary.down > 0) {
        text = t.majorOutage;
        cssClass = 'text-red-600 bg-red-50 border-red-200';
      } else if (summary.degraded > 0) {
        text = t.someIssues;
        cssClass = 'text-amber-600 bg-amber-50 border-amber-200';
      } else {
        text = t.allOperational;
        cssClass = 'text-emerald-600 bg-emerald-50 border-emerald-200';
      }
      summaryEl.innerHTML = `<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border ${cssClass} font-semibold text-sm">${text}</div>`;
    }

    if (countEl) {
      countEl.innerHTML = `
        <span class="inline-flex items-center gap-1.5 text-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <strong>${summary.operational}</strong> ${t.servicesOperational}
        </span>
        <span class="inline-flex items-center gap-1.5 text-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <strong>${summary.degraded}</strong> ${t.servicesDegraded}
        </span>
        <span class="inline-flex items-center gap-1.5 text-sm">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <strong>${summary.down}</strong> ${t.servicesDown}
        </span>
      `;
    }
  },

  renderIncidents() {
    const incidents = StatusChecker.getRecentIncidents();
    IncidentFeed.render(incidents);
  },

  updateOutageBanner() {
    const banner = document.getElementById('outage-banner');
    if (!banner) return;

    const t = I18n.getAll();
    const majorOutages = Object.values(StatusChecker.results).filter(r => r.status === 'major');

    if (majorOutages.length > 0) {
      const names = majorOutages.map(r => r.name).join(', ');
      banner.textContent = `${names} ${t.outageAlert}`;
      banner.classList.add('visible');
    } else {
      banner.classList.remove('visible');
    }
  },

  updateDynamicMeta() {
    const majorOutages = Object.values(StatusChecker.results).filter(r => r.status === 'major');
    if (majorOutages.length > 0) {
      const name = majorOutages[0].name;
      document.title = `${name} is DOWN - SaaS Down Radar`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.content = `${name} is currently experiencing a major outage. Check real-time status of 20+ SaaS services on SaaS Down Radar.`;
      }
    } else {
      document.title = 'SaaS Down Radar - Real-Time SaaS Status & Outage Monitor';
    }
  },

  initFilters() {
    const container = document.getElementById('category-filters');
    if (!container) return;

    const t = I18n.getAll();
    const categoryKeys = {
      'All': 'filterAll',
      'Developer Tools': 'filterDevTools',
      'Cloud Providers': 'filterCloud',
      'Communication': 'filterComm',
      'AI Services': 'filterAI',
      'Productivity': 'filterProductivity',
      'Payments': 'filterPayments',
      'Monitoring': 'filterMonitoring'
    };

    container.innerHTML = ServiceManager.categories.map(cat => {
      const label = t[categoryKeys[cat]] || cat;
      return `<button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${label}</button>`;
    }).join('');

    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      this.currentFilter = btn.dataset.category;
      this.filterAndRender();
    });
  },

  initLanguageSelector() {
    const select = document.getElementById('lang-select');
    if (!select) return;

    select.innerHTML = I18n.supportedLangs.map(lang =>
      `<option value="${lang}" ${lang === I18n.currentLang ? 'selected' : ''}>${I18n.langNames[lang]}</option>`
    ).join('');

    select.addEventListener('change', (e) => {
      I18n.setLanguage(e.target.value);
      // Reload translations in all modules
      const t = I18n.getAll();
      CardRenderer.setTranslations(t);
      IncidentFeed.setTranslations(t);
      this.applyTranslations(t);
      this.initFilters();
      Search.setPlaceholder(t.searchPlaceholder);
      this.filterAndRender();
      this.updateSummary();
      this.renderIncidents();
      this.updateOutageBanner();
    });
  },

  applyTranslations(t) {
    // Update static text elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (t[key]) el.textContent = t[key];
    });
    // Update page subtitle
    const subtitle = document.getElementById('page-subtitle');
    if (subtitle) subtitle.textContent = t.subtitle;

    // Update nav links
    document.querySelectorAll('[data-i18n-nav]').forEach(el => {
      const key = el.dataset.i18nNav;
      if (t[key]) el.textContent = t[key];
    });
  },

  toggleComponents(serviceId) {
    const panel = document.getElementById(`components-${serviceId}`);
    if (panel) {
      panel.classList.toggle('expanded');
      SheetsWebhook.log('service_click', '/', serviceId);
    }
  },

  initShareButtons() {
    const url = encodeURIComponent(window.location.href);
    const t = I18n.getAll();
    const text = encodeURIComponent(t.shareText);
    const title = encodeURIComponent(t.shareTitle);

    const twitterBtn = document.getElementById('share-twitter');
    const redditBtn = document.getElementById('share-reddit');
    const fbBtn = document.getElementById('share-facebook');
    const linkedinBtn = document.getElementById('share-linkedin');

    if (twitterBtn) twitterBtn.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    if (redditBtn) redditBtn.href = `https://reddit.com/submit?url=${url}&title=${title}`;
    if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (linkedinBtn) linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  },

  lastRefreshTime: Date.now(),

  startRefreshTimer() {
    const timerEl = document.getElementById('refresh-timer');
    if (!timerEl) return;

    setInterval(() => {
      const diff = Date.now() - this.lastRefreshTime;
      const remaining = Math.max(0, 300 - Math.floor(diff / 1000));
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
