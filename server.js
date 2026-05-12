const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/datetime', (req, res) => {
  const now = new Date();
  res.json({
    date: now.toDateString(),
    time: now.toTimeString().split(' ')[0],
    iso: now.toISOString()
  });
});

app.get('/api/client-info', (req, res) => {
  const ip = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0].trim()
    : req.socket.remoteAddress;
  res.json({ ip });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
