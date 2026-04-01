// Service definitions and category management
const ServiceManager = {
  services: [],
  categories: [
    'All', 'Developer Tools', 'Cloud Providers', 'Communication',
    'AI Services', 'Productivity', 'Payments', 'Monitoring'
  ],

  async load() {
    try {
      const resp = await fetch('./data/services.json');
      this.services = await resp.json();
      return this.services;
    } catch (e) {
      console.error('Failed to load services:', e);
      return [];
    }
  },

  getByCategory(category) {
    if (!category || category === 'All') return this.services;
    return this.services.filter(s => s.category === category);
  },

  search(query) {
    if (!query) return this.services;
    const q = query.toLowerCase().replace(/is\s+/i, '').replace(/\s+down\??/i, '').trim();
    if (!q) return this.services;
    return this.services.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  },

  getById(id) {
    return this.services.find(s => s.id === id);
  }
};
