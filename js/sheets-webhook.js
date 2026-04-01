// Google Sheets webhook for visit and search logging
const SheetsWebhook = {
  // Replace with actual Google Apps Script Web App URL when deployed
  webhookUrl: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
  enabled: false,

  init() {
    // Enable only in production
    this.enabled = window.location.hostname !== 'localhost';
  },

  async log(event, page, searchQuery) {
    if (!this.enabled) return;

    try {
      const payload = {
        event: event || 'page_visit',
        page: page || window.location.pathname,
        search_query: searchQuery || '',
        userAgent: navigator.userAgent,
        browserLang: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      // Use sendBeacon for non-blocking logging
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.webhookUrl, JSON.stringify(payload));
      } else {
        fetch(this.webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(payload)
        }).catch(() => {});
      }
    } catch (e) {
      // Silently fail - logging should never break the app
    }
  }
};

/*
 * Google Apps Script code to deploy as Web App:
 *
 * function doPost(e) {
 *   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Visits");
 *   const data = JSON.parse(e.postData.contents);
 *   sheet.appendRow([
 *     new Date(),
 *     data.event || "page_visit",
 *     data.page || "/",
 *     data.search_query || "",
 *     data.userAgent || "",
 *     data.browserLang || "",
 *     data.timezone || ""
 *   ]);
 *   return ContentService.createTextOutput(
 *     JSON.stringify({ status: "ok" })
 *   ).setMimeType(ContentService.MimeType.JSON);
 * }
 */
