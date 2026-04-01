// Ad injection for Adsterra and Google AdSense
const AdManager = {
  adsenseId: 'ca-pub-7098271335538021',

  init() {
    // Inject AdSense script
    this.injectAdSense();
    // Initialize ad slots
    this.initSlots();
  },

  injectAdSense() {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.adsenseId}`;
    document.head.appendChild(script);
  },

  initSlots() {
    // Adsterra placeholders are already in HTML
    // Initialize AdSense fallback slots
    const adSlots = document.querySelectorAll('.ad-slot[data-adsense]');
    adSlots.forEach(slot => {
      try {
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.setAttribute('data-ad-client', this.adsenseId);
        ins.setAttribute('data-ad-slot', slot.dataset.adsense);
        ins.setAttribute('data-ad-format', 'auto');
        ins.setAttribute('data-full-width-responsive', 'true');
        slot.appendChild(ins);
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Ad blocker or error - leave placeholder
      }
    });
  }
};
