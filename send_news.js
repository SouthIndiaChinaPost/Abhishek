const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const client     = require('twilio')(accountSid, authToken);
const Parser     = require('rss-parser');
const parser     = new Parser();

async function fetchSCMPHeadlines(n = 5) {
  const feed = await parser.parseURL('https://www.scmp.com/rss/91/feed');
  return feed.items.slice(0, n).map(item => `• ${item.title}\n  ${item.link}`);
}

async function sendWhatsApp(body) {
  const message = await client.messages.create({
    from: 'whatsapp:+14155238886',
    to:   process.env.TWILIO_WHATSAPP_TO,
    body: body
  });
  console.log('Sent:', message.sid);
}

(async () => {
  const headlines = await fetchSCMPHeadlines();
  const body = `📰 *SCMP Daily Briefing*\n\n` + headlines.join('\n\n');
  await sendWhatsApp(body);
})();
