// Internationalization support
const I18n = {
  translations: {},
  currentLang: 'en',
  supportedLangs: ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt'],
  langNames: {
    en: 'English',
    ko: '한국어',
    ja: '日本語',
    zh: '中文',
    es: 'Espanol',
    fr: 'Francais',
    de: 'Deutsch',
    pt: 'Portugues'
  },

  async load() {
    try {
      const resp = await fetch('./data/translations.json');
      this.translations = await resp.json();
    } catch (e) {
      console.error('Failed to load translations:', e);
    }
  },

  detectLanguage() {
    // Check ?lang=xx URL param first (highest priority)
    try {
      const urlParam = new URLSearchParams(window.location.search).get('lang');
      if (urlParam && this.supportedLangs.includes(urlParam)) {
        this.currentLang = urlParam;
        localStorage.setItem('sdr_lang', urlParam);
        return urlParam;
      }
    } catch (e) {}

    // Check saved preference
    const saved = localStorage.getItem('sdr_lang');
    if (saved && this.supportedLangs.includes(saved)) {
      this.currentLang = saved;
      return this.currentLang;
    }

    // Auto-detect from browser
    const userLang = navigator.language || navigator.languages?.[0] || 'en';
    const detected = this.supportedLangs.find(l => userLang.startsWith(l)) || 'en';
    this.currentLang = detected;
    return detected;
  },

  setLanguage(lang) {
    if (this.supportedLangs.includes(lang)) {
      this.currentLang = lang;
      localStorage.setItem('sdr_lang', lang);
      document.documentElement.lang = lang;
    }
  },

  t(key) {
    return this.translations[this.currentLang]?.[key] ||
           this.translations['en']?.[key] ||
           key;
  },

  getAll() {
    return this.translations[this.currentLang] || this.translations['en'] || {};
  }
};
