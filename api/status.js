export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter required" });
  }

  const allowedDomains = [
    "status.openai.com",
    "www.githubstatus.com",
    "status.slack.com",
    "www.notion-status.com",
    "www.vercel-status.com",
    "www.cloudflarestatus.com",
    "status.stripe.com",
    "discordstatus.com",
    "www.zoomstatus.com",
    "www.netlifystatus.com",
    "status.npmjs.org",
    "linearstatus.com",
    "status.figma.com",
    "status.twilio.com",
    "status.datadoghq.com",
    "health.aws.amazon.com",
    "status.cloud.google.com",
    "status.azure.com",
    "jira-software.status.atlassian.com",
    "www.shopifystatus.com"
  ];

  let domain;
  try {
    domain = new URL(url).hostname;
  } catch (e) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (!allowedDomains.includes(domain)) {
    return res.status(403).json({ error: "Domain not allowed" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "SaaSDownRadar/1.0",
        "Accept": "application/json"
      }
    });
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch status", details: error.message });
  }
}
