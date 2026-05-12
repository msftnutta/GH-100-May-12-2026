require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Azure Maps configuration sourced from environment (.env file).
const AZURE_MAPS_KEY = process.env.AZURE_MAPS_KEY;
const AZURE_MAPS_ENDPOINT = (process.env.AZURE_MAPS_ENDPOINT || 'https://atlas.microsoft.com').replace(/\/+$/, '');

if (!AZURE_MAPS_KEY) {
  console.warn('[warn] AZURE_MAPS_KEY is not set. Copy .env.example to .env and provide a key.');
}

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

// Proxy Azure Maps Weather API so the subscription key stays on the server.
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon query params are required' });
  }

  if (!AZURE_MAPS_KEY) {
    return res.status(500).json({ error: 'Server is not configured: AZURE_MAPS_KEY missing' });
  }

  try {
    const base = `${AZURE_MAPS_ENDPOINT}/weather`;
    const common = `api-version=1.1&query=${encodeURIComponent(`${lat},${lon}`)}&subscription-key=${AZURE_MAPS_KEY}`;
    const currentUrl = `${base}/currentConditions/json?${common}`;
    const forecastUrl = `${base}/forecast/daily/json?${common}&duration=5`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      const failing = currentRes.ok ? forecastRes : currentRes;
      const detail = await failing.text();
      return res.status(failing.status).json({ error: 'Azure Maps request failed', detail });
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    const c = (current.results && current.results[0]) || null;
    res.json({
      current: c
        ? {
            phrase: c.phrase,
            iconCode: c.iconCode,
            temperature: c.temperature && c.temperature.value,
            unit: c.temperature && c.temperature.unit
          }
        : null,
      forecast: (forecast.forecasts || []).map((f) => ({
        date: f.date,
        iconCode: f.day && f.day.iconCode,
        phrase: f.day && f.day.shortPhrase,
        minTemp: f.temperature && f.temperature.minimum && f.temperature.minimum.value,
        maxTemp: f.temperature && f.temperature.maximum && f.temperature.maximum.value,
        unit: f.temperature && f.temperature.maximum && f.temperature.maximum.unit
      }))
    });
  } catch (err) {
    console.error('Weather proxy error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
