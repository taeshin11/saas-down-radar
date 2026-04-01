// "Is X Down?" search logic
const Search = {
  input: null,
  debounceTimer: null,
  onSearch: null,

  init(inputId, callback) {
    this.input = document.getElementById(inputId);
    this.onSearch = callback;

    if (this.input) {
      this.input.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          const query = this.input.value.trim();
          if (this.onSearch) this.onSearch(query);

          // Log search to webhook
          if (query.length > 2) {
            SheetsWebhook.log('search', '/', query);
          }
        }, 300);
      });

      // Handle keyboard shortcut (/ to focus)
      document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== this.input) {
          e.preventDefault();
          this.input.focus();
        }
        if (e.key === 'Escape' && document.activeElement === this.input) {
          this.input.value = '';
          this.input.blur();
          if (this.onSearch) this.onSearch('');
        }
      });
    }
  },

  setPlaceholder(text) {
    if (this.input) this.input.placeholder = text;
  }
};
