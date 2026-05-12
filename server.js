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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
