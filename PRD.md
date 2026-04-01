# PRD: SaaS Down Radar

## Real-Time SaaS Status & Outage Monitor

---

## 1. Project Overview

### Service Name
SaaS Down Radar

### Short Title
Real-Time SaaS Status & Outage Monitor

### Description
SaaS Down Radar is a free dashboard that monitors major SaaS services (ChatGPT, AWS, GitHub, Slack, Notion, Vercel, etc.) and displays their real-time up/down/degraded status. It fetches data from public status pages and RSS feeds, showing color-coded status indicators, last-checked timestamps, incident history, uptime percentage badges, and an "Is X Down?" search feature. The goal is to become the go-to page when users wonder if a service is experiencing an outage.

### Target Audience
- Developers and DevOps engineers monitoring dependencies
- Remote workers relying on SaaS tools daily
- IT administrators tracking service availability
- General users wondering "Is X down right now?"
- Tech journalists covering outage events

### Target Keywords (SEO)
- "is chatgpt down"
- "aws status"
- "saas outage monitor"
- "is github down"
- "is slack down"
- "service status checker"
- "cloud service outages today"

---

## 2. Harness Design Methodology

### Agent Workflow

```
Planner Agent
  -> Defines milestones, feature_list.json, file structure
  -> Outputs PRD.md (this document)

Initializer Agent
  -> Reads PRD.md
  -> Generates feature_list.json
  -> Generates claude-progress.txt
  -> Generates init.sh (project scaffold)
  -> Runs init.sh to bootstrap project

Fixed Session Routine
  -> Each session: read claude-progress.txt -> pick next incomplete feature -> build -> test -> mark done -> git push

Builder Agent
  -> Implements features one by one per feature_list.json
  -> Writes code, tests locally, commits

Reviewer Agent
  -> Reviews code quality, accessibility, SEO, responsiveness
  -> Suggests fixes before milestone push
```

### Session Routine (Per Coding Session)

1. Read `claude-progress.txt` to find current milestone and next incomplete feature.
2. Implement the feature.
3. Test locally (status checks, grid rendering, search, mobile layout).
4. Mark feature as complete in `claude-progress.txt`.
5. Git commit with descriptive message.
6. At milestone completion: git push, verify deployment on Vercel.

---

## 3. Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Vanilla HTML/CSS/JS | $0 |
| Styling | Tailwind CSS via CDN | $0 |
| Status Data | Public status pages / RSS feeds / Atlassian Statuspage API | $0 |
| Proxy (if needed) | Railway free tier or Vercel serverless functions | $0 |
| Hosting | Vercel (free tier) | $0 |
| Data Collection | Google Sheets + Apps Script Webhook | $0 |
| Ads | Adsterra (primary), Google AdSense (secondary) | Revenue |
| Version Control | GitHub (private repo) | $0 |
| **Total** | | **$0** |

---

## 4. Monitored Services

### Tier 1 (Launch - 20 services)

| Service | Status Page URL | Method |
|---------|----------------|--------|
| ChatGPT / OpenAI | https://status.openai.com | Atlassian Statuspage API |
| GitHub | https://www.githubstatus.com | Atlassian Statuspage API |
| AWS | https://health.aws.amazon.com | RSS feed parse |
| Google Cloud | https://status.cloud.google.com | RSS/JSON |
| Azure | https://status.azure.com | RSS feed |
| Slack | https://status.slack.com | Atlassian Statuspage API |
| Notion | https://status.notion.so | Atlassian Statuspage API |
| Vercel | https://www.vercel-status.com | Atlassian Statuspage API |
| Cloudflare | https://www.cloudflarestatus.com | Atlassian Statuspage API |
| Stripe | https://status.stripe.com | Atlassian Statuspage API |
| Twilio | https://status.twilio.com | Atlassian Statuspage API |
| Datadog | https://status.datadoghq.com | Atlassian Statuspage API |
| Discord | https://discordstatus.com | Atlassian Statuspage API |
| Zoom | https://status.zoom.us | Atlassian Statuspage API |
| Netlify | https://www.netlifystatus.com | Atlassian Statuspage API |
| Heroku | https://status.heroku.com | Atlassian Statuspage API |
| npm | https://status.npmjs.org | Atlassian Statuspage API |
| Docker Hub | https://www.dockerstatus.com | Atlassian Statuspage API |
| Linear | https://status.linear.app | Atlassian Statuspage API |
| Figma | https://status.figma.com | Atlassian Statuspage API |

### Atlassian Statuspage API Pattern
Most services use Atlassian Statuspage. The API is public:

```
GET https://{statuspage-domain}/api/v2/status.json
GET https://{statuspage-domain}/api/v2/summary.json
GET https://{statuspage-domain}/api/v2/incidents.json
GET https://{statuspage-domain}/api/v2/components.json
```

### Status Indicators

| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| Operational | Green | check circle | All systems operational |
| Degraded Performance | Yellow | warning triangle | Partial issues |
| Partial Outage | Orange | alert circle | Some components down |
| Major Outage | Red | x circle | Service is down |
| Unknown | Gray | question mark | Unable to determine |

---

## 5. Features List

### Core Features

| ID | Feature | Priority | Milestone |
|----|---------|----------|-----------|
| F01 | Service grid with status indicators (green/yellow/orange/red/gray) | P0 | M1 |
| F02 | Last checked timestamp per service | P0 | M1 |
| F03 | "Is X Down?" search bar | P0 | M1 |
| F04 | Service cards with name, status, description | P0 | M1 |
| F05 | Overall status summary (X of Y services operational) | P0 | M1 |
| F06 | Auto-refresh status every 5 minutes | P0 | M2 |
| F07 | Incident history feed (latest incidents from all services) | P0 | M2 |
| F08 | Uptime percentage badges (30-day estimate) | P1 | M2 |
| F09 | Service detail expansion (click card to see components) | P1 | M2 |
| F10 | Category filters (Developer Tools, Cloud, Communication, Productivity) | P1 | M3 |
| F11 | Responsive mobile-first layout | P0 | M1 |
| F12 | Loading skeletons while fetching status | P0 | M1 |
| F13 | Status notification banner (if major outage detected) | P1 | M3 |
| F14 | Service count by status (X operational, Y degraded, Z down) | P0 | M2 |

### SEO & Meta

| ID | Feature | Priority | Milestone |
|----|---------|----------|-----------|
| S01 | Meta tags (title, description, keywords) | P0 | M3 |
| S02 | Open Graph tags | P0 | M3 |
| S03 | Twitter Card tags | P0 | M3 |
| S04 | JSON-LD structured data (WebSite, WebApplication) | P0 | M3 |
| S05 | sitemap.xml | P0 | M3 |
| S06 | robots.txt | P0 | M3 |
| S07 | Semantic HTML throughout | P0 | M1 |
| S08 | Canonical URL | P1 | M3 |
| S09 | Dynamic meta description based on current outages | P1 | M3 |

### Monetization & Analytics

| ID | Feature | Priority | Milestone |
|----|---------|----------|-----------|
| A01 | Adsterra ad unit placeholders (header, sidebar, footer, between cards) | P0 | M3 |
| A02 | Adsterra ad key injection script | P0 | M3 |
| A03 | Google AdSense fallback slots | P1 | M4 |
| A04 | Visitor counter (Today + Total) in footer | P0 | M3 |
| A05 | Google Sheets webhook - log visits and searches | P0 | M3 |

### Internationalization & UX

| ID | Feature | Priority | Milestone |
|----|---------|----------|-----------|
| I01 | Auto i18n - browser language detection | P0 | M4 |
| I02 | Support 8+ languages (EN, KO, JA, ZH, ES, FR, DE, PT) | P0 | M4 |
| I03 | Language selector dropdown in header | P1 | M4 |
| I04 | Social sharing buttons (Twitter, Reddit, Facebook, LinkedIn) | P0 | M4 |
| I05 | Feedback email link (taeshinkim11@gmail.com) | P0 | M4 |

### Static Pages

| ID | Feature | Priority | Milestone |
|----|---------|----------|-----------|
| P01 | About page | P0 | M4 |
| P02 | How to Use / FAQ page | P0 | M4 |
| P03 | Privacy Policy page | P0 | M4 |
| P04 | Terms of Service page | P0 | M4 |

---

## 6. File & Folder Structure

```
SaaSDownRadar/
├── index.html                  # Main status dashboard
├── about.html                  # About page
├── faq.html                    # How to Use / FAQ
├── privacy.html                # Privacy Policy
├── terms.html                  # Terms of Service
├── sitemap.xml                 # SEO sitemap
├── robots.txt                  # SEO robots
├── css/
│   └── style.css               # Custom styles (status colors, grid, soft BG)
├── js/
│   ├── app.js                  # Main application logic
│   ├── status-checker.js       # Fetch status from public APIs
│   ├── services.js             # Service definitions (URLs, categories)
│   ├── incidents.js            # Incident history parsing
│   ├── search.js               # "Is X Down?" search logic
│   ├── cards.js                # Service card rendering
│   ├── cache.js                # localStorage caching
│   ├── i18n.js                 # Internationalization
│   ├── visitor.js              # Visitor counter
│   ├── ads.js                  # Ad injection
│   └── sheets-webhook.js       # Google Sheets visit logging
├── data/
│   ├── services.json           # Service definitions and status page URLs
│   └── translations.json       # i18n strings
├── api/
│   └── status.js               # Vercel serverless function (CORS proxy if needed)
├── assets/
│   ├── og-image.png            # Open Graph image
│   ├── favicon.ico             # Favicon
│   └── icons/                  # Service logos/icons (SVG)
├── feature_list.json           # Harness: feature tracking
├── claude-progress.txt         # Harness: session progress
├── init.sh                     # Harness: project initializer
├── vercel.json                 # Vercel config (with serverless function routes)
├── .gitignore
└── README.md
```

---

## 7. Design System

### Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background (primary) | Soft mint gray | #F0FDF4 blended with #F8FAFC |
| Background (card) | Pure soft white | #FEFFFE |
| Background (dark mode) | Deep dark blue | #0C1222 |
| Text (primary) | Slate 800 | #1E293B |
| Text (secondary) | Slate 500 | #64748B |
| Status: Operational | Emerald green | #10B981 |
| Status: Degraded | Amber yellow | #F59E0B |
| Status: Partial Outage | Orange | #F97316 |
| Status: Major Outage | Red | #EF4444 |
| Status: Unknown | Gray | #9CA3AF |
| Accent (primary) | Blue | #3B82F6 |
| Accent (secondary) | Violet | #8B5CF6 |
| Card border (normal) | Gray 200 | #E5E7EB |
| Card border (outage) | Red 300 | #FCA5A5 |

### Status Card Design

```
+------------------------------------------+
| [Service Logo]  Service Name     [●]     |
|                                  GREEN   |
| Status: All Systems Operational          |
| Last checked: 2 min ago                  |
|                                          |
| Uptime: [████████████████████░] 99.9%   |
+------------------------------------------+
```

When outage:
```
+------------------------------------------+
| [Service Logo]  Service Name     [●]     |
|                                  RED     |
| Status: Major Outage                     |
| Last checked: 1 min ago                  |
|                                          |
| ⚠ Investigating: API errors reported    |
| Uptime: [██████████████████░░] 99.1%    |
+------------------------------------------+
```

### Typography

- Headings: `Inter` (700 weight)
- Body: `Inter` (400 weight)
- Status text: `Inter` (600 weight)
- Timestamps: `Inter` (400 weight, smaller size, muted)

### Grid Layout

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns
- Cards have consistent height within rows

### Breakpoints

| Name | Width |
|------|-------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

---

## 8. Milestones & Git Strategy

### Milestone 1: Core Status Dashboard (MVP)
**Deliverables:**
- Project scaffold
- Service definitions (services.json with 20 services)
- Status fetcher (Atlassian Statuspage API integration)
- Service grid with status indicators
- "Is X Down?" search bar
- Overall status summary
- Loading skeletons
- Semantic HTML + responsive layout

**Git commits:**
- `feat: scaffold project structure`
- `feat: create services.json with 20 services`
- `feat: implement Atlassian Statuspage API fetcher`
- `feat: render service status grid`
- `feat: add "Is X Down?" search`
- `feat: add overall status summary`
- `feat: add loading skeletons`
- `style: responsive mobile-first layout`
- `milestone: M1 complete - core status dashboard`

**Push to GitHub at milestone completion.**

### Milestone 2: Incidents & Auto-Refresh
**Deliverables:**
- Incident history feed (latest from all services)
- Auto-refresh every 5 minutes
- Uptime percentage badges
- Service detail expansion
- Status count summary
- localStorage caching

**Git commits:**
- `feat: add incident history feed`
- `feat: implement auto-refresh (5 min interval)`
- `feat: add uptime percentage badges`
- `feat: add service detail expansion`
- `feat: add status count summary`
- `feat: implement localStorage caching`
- `milestone: M2 complete - incidents and auto-refresh`

**Push to GitHub at milestone completion.**

### Milestone 3: SEO, Ads & Analytics
**Deliverables:**
- Full SEO (meta, OG, JSON-LD, sitemap, robots.txt)
- Dynamic meta description based on current outages
- Adsterra ad placeholders and injection
- Visitor counter in footer
- Google Sheets visit webhook
- Category filters
- Outage notification banner

**Git commits:**
- `feat: add SEO meta, OG, JSON-LD tags`
- `feat: create sitemap.xml and robots.txt`
- `feat: add dynamic meta description`
- `feat: integrate Adsterra ad units`
- `feat: add visitor counter`
- `feat: integrate visit logging webhook`
- `feat: add category filters`
- `feat: add outage notification banner`
- `milestone: M3 complete - SEO, ads, analytics`

**Push to GitHub at milestone completion.**

### Milestone 4: i18n, Pages & Polish
**Deliverables:**
- Auto i18n with 8+ languages
- Social sharing buttons
- Feedback mechanism
- About, FAQ, Privacy, Terms pages
- AdSense fallback
- Final QA and performance optimization

**Git commits:**
- `feat: implement i18n (8 languages)`
- `feat: add social sharing buttons`
- `feat: add feedback email link`
- `feat: create static pages`
- `feat: add AdSense fallback`
- `chore: final QA and optimization`
- `milestone: M4 complete - full release`

**Push to GitHub at milestone completion.**

---

## 9. CORS Proxy Strategy

### Problem
Some status page APIs may block cross-origin requests from browsers.

### Solution: Vercel Serverless Function

Create `api/status.js` as a Vercel serverless function:

```javascript
// api/status.js
export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter required" });
  }

  // Whitelist only status page domains
  const allowedDomains = [
    "status.openai.com",
    "www.githubstatus.com",
    "status.slack.com",
    "status.notion.so",
    "www.vercel-status.com",
    "www.cloudflarestatus.com",
    "status.stripe.com",
    "discordstatus.com",
    "status.zoom.us",
    "www.netlifystatus.com",
    "status.heroku.com",
    "status.npmjs.org",
    "www.dockerstatus.com",
    "status.linear.app",
    "status.figma.com",
    "status.twilio.com",
    "status.datadoghq.com"
  ];

  const domain = new URL(url).hostname;
  if (!allowedDomains.includes(domain)) {
    return res.status(403).json({ error: "Domain not allowed" });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch status" });
  }
}
```

### Vercel Config

```json
{
  "rewrites": [
    { "source": "/api/status", "destination": "/api/status.js" }
  ]
}
```

---

## 10. Google Sheets Webhook (Apps Script)

### Visit & Search Logging

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Visits");
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.event || "page_visit",
    data.page || "/",
    data.search_query || "",
    data.userAgent || "",
    data.browserLang || "",
    data.timezone || ""
  ]);
  return ContentService.createTextOutput(
    JSON.stringify({ status: "ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

### Logged Events
- `page_visit`: User loads the dashboard
- `search`: User searches "Is X Down?"
- `service_click`: User clicks to expand a service card
- `share`: User shares via social button

---

## 11. Ad Monetization Strategy

### Adsterra (Primary)

| Slot | Position | Type | Size |
|------|----------|------|------|
| ad-header-banner | Top of page, below search | Banner | 728x90 / 320x50 |
| ad-between-rows | After every 2nd row in grid | Native | 728x90 |
| ad-sidebar | Right sidebar (desktop) | Sticky | 300x600 |
| ad-incidents | Above incident history feed | Native | 300x250 |
| ad-footer | Above footer | Banner | 728x90 |

### Injection Pattern

```html
<div class="ad-slot" id="ad-header-banner" data-ad-key="ADSTERRA_KEY_HERE">
  <ins class="adsterra-ad" data-key="ADSTERRA_KEY_HERE"></ins>
  <script>(adsterra = window.adsterra || []).push({});</script>
</div>
```

---

## 12. Visitor Counter

```html
<footer>
  <div class="visitor-counter">
    <span>Today: <strong id="visitors-today">--</strong></span>
    <span>Total: <strong id="visitors-total">--</strong></span>
  </div>
</footer>
```

- Non-intrusive footer placement.
- Backed by Google Sheets visit count.

---

## 13. i18n Strategy

### Languages Supported
1. English (en)
2. Korean (ko)
3. Japanese (ja)
4. Chinese Simplified (zh)
5. Spanish (es)
6. French (fr)
7. German (de)
8. Portuguese (pt)

### Translation Scope
- UI labels: "All Systems Operational", "Major Outage", "Degraded", etc.
- Search placeholder text
- Status descriptions
- Navigation and footer
- Static page content
- Service names remain in English

### Auto-Detection

```javascript
const userLang = navigator.language || navigator.languages[0];
const supportedLangs = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt'];
const lang = supportedLangs.find(l => userLang.startsWith(l)) || 'en';
```

---

## 14. SEO Implementation

### Meta Tags

```html
<meta name="description" content="Real-time status monitor for ChatGPT, AWS, GitHub, Slack, and 20+ SaaS services. Check if a service is down right now with live status indicators.">
<meta name="keywords" content="is chatgpt down, aws status, saas outage monitor, is github down, service status checker, cloud outage tracker">
```

### Open Graph

```html
<meta property="og:title" content="SaaS Down Radar - Real-Time SaaS Status Monitor">
<meta property="og:description" content="Is ChatGPT down? Check real-time status of 20+ SaaS services including AWS, GitHub, Slack, and more.">
<meta property="og:image" content="https://saas-down-radar.vercel.app/assets/og-image.png">
<meta property="og:url" content="https://saas-down-radar.vercel.app/">
<meta property="og:type" content="website">
```

### JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "SaaS Down Radar",
  "description": "Real-time SaaS status and outage monitor for 20+ major services.",
  "url": "https://saas-down-radar.vercel.app/",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### Dynamic SEO
- If a major outage is detected, dynamically update the `<title>` tag:
  `"ChatGPT is DOWN - SaaS Down Radar"`
- This helps capture search traffic during outage events.

---

## 15. Deployment Checklist

### Pre-Deployment
- [ ] All features in feature_list.json marked complete
- [ ] 20 services configured and status checks working
- [ ] CORS proxy (serverless function) working if needed
- [ ] Status indicators rendering correctly
- [ ] Search functionality working
- [ ] Incident history displaying
- [ ] Auto-refresh working (5 min)
- [ ] Mobile responsive at all breakpoints
- [ ] SEO validated
- [ ] Ad placeholders in place
- [ ] Visitor counter functional
- [ ] Google Sheets webhook receiving data
- [ ] i18n working for 8+ languages
- [ ] All static pages complete
- [ ] Lighthouse Performance > 85, SEO > 95

### Deployment Steps
1. Create GitHub repo: `gh repo create SaaSDownRadar --private --source=. --push`
2. Deploy to Vercel: `vercel --prod`
3. Verify serverless functions working on Vercel.
4. Verify deployment at Vercel URL.
5. Submit sitemap to Google Search Console.
6. Test all features on production.

### Post-Deployment
- [ ] Google Search Console configured
- [ ] Adsterra ads configured
- [ ] Share on Reddit (r/sysadmin, r/devops, r/webdev)
- [ ] Share on Hacker News
- [ ] Tweet during next major outage for visibility

---

## 16. Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| CORS blocking from status pages | Cannot fetch status | Vercel serverless proxy, cache responses |
| Status page API changes | Broken status checks | Abstract fetcher per service, easy to update |
| Too many services, slow load | Poor UX | Parallel fetch with Promise.allSettled, loading skeletons |
| False positives/negatives | User trust loss | Show "Last checked" time, link to official status page |
| Rate limiting on status APIs | Stale data | 5-min refresh interval, localStorage cache |
| Vercel serverless cold starts | Slow first fetch | Warm function with cron or keep-alive |

---

## 17. Success Metrics

| Metric | Target (30 days) |
|--------|-----------------|
| Daily visitors | 500+ (spikes during outages) |
| Google indexed pages | All pages |
| Lighthouse Performance | > 85 |
| Lighthouse SEO | > 95 |
| Ad impressions | 1500+/day |
| "Is X Down" search queries | 100+/day |
| Social shares during outages | 50+ per incident |

---

## 18. Privacy & Data

- No user accounts required.
- Visit data collected: timestamp, page, search queries, user agent, language, timezone.
- No personally identifiable information stored.
- Status data fetched from public APIs only.
- All practices disclosed in Privacy Policy.
- GDPR-compliant.

---

## 19. Future Enhancements (Post-Launch)

- Push notifications for outages (browser notifications API)
- Email alerts for specific services
- Slack/Discord bot integration
- Historical uptime charts (30-day, 90-day)
- Status page for custom services (user-submitted)
- Outage timeline visualization
- Incident severity scoring
- Mobile app (PWA)
- RSS feed for outage events
- API endpoint for programmatic access
- Regional status (check from multiple locations)
- Response time monitoring

---

## 20. Service Categories

### Developer Tools
- GitHub, Vercel, Netlify, Heroku, npm, Docker Hub, Linear

### Cloud Providers
- AWS, Google Cloud, Azure, Cloudflare

### Communication
- Slack, Discord, Zoom

### AI Services
- ChatGPT / OpenAI

### Productivity
- Notion, Figma

### Payments
- Stripe

### Monitoring
- Datadog, Twilio

### Expansion Plan (Post-Launch)
- Jira, Confluence, MongoDB Atlas, Supabase, Firebase, Render, PlanetScale, Airtable, Zapier, HubSpot, Salesforce, Shopify, Dropbox, Box, Microsoft 365

---

*Document Version: 1.0*
*Created: 2026-04-01*
*Methodology: Harness Design*
