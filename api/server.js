const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');  // Zorg ervoor dat node-fetch geïnstalleerd is
const app = express();

app.use(cors());  // Zorg ervoor dat CORS is ingeschakeld
app.use(express.json());

// Je originele WebApp URL
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzbyx2Qhx7IKpC14vAKqp9e8dDozV4dEqFeTqVoAaKbO1NwvY-xu6-13TRag3woL2afuQ/exec';

// POST route voor de proxy
app.post('/proxy', async (req, res) => {
  console.log('Ontvangen van React of Postman:', req.body);

  try {
    const response = await fetch(WEBAPP_URL, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' }
    });

    const text = await response.text();
    console.log('Antwoord van Web App:', text);

    res.status(200).send(text);
  } catch (err) {
    console.error('❌ FOUT in fetch:', err);
    res.status(500).send('Fout bij proxy');
  }
});

// Zorg ervoor dat je backend luistert op de juiste poort
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy draait op http://localhost:${PORT}`));
