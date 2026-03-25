module.exports = function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'GITHUB_CLIENT_ID not configured' });
  }
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
  res.writeHead(302, { Location: authUrl });
  res.end();
};
