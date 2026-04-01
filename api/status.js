export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter required" });
  }

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
    "status.datadoghq.com",
    "health.aws.amazon.com",
    "status.cloud.google.com",
    "status.azure.com"
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
