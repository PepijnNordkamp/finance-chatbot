const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzbyx2Qhx7IKpC14vAKqp9e8dDozV4dEqFeTqVoAaKbO1NwvY-xu6-13TRag3woL2afuQ/exec';

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

app.listen(4000, () => console.log('Proxy draait op http://localhost:4000'));
