export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).json({ error: 'GITHUB_CLIENT_ID not set' });
    return;
  }
  res.setHeader('Location', 'https://github.com/login/oauth/authorize?client_id=' + clientId + '&scope=repo');
  res.status(302).end();
}
