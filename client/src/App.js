// src/App.js
import React, { useState } from 'react';
import './App.css';

const WEBAPP_URL = 'http://localhost:4000/proxy';

function App() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');

  const parseInput = (text) => {
    // Voorbeeldinvoer: "Op 7 april 12,90 uitgegeven aan OV"
    const match = text.match(/(\d{1,2}) (\w+) (\d+[\.,]?\d*) (euro)? ?(uitgegeven|ontvangen)? aan (.+)/i);
    if (!match) return null;

    const day = match[1];
    const monthName = match[2].toLowerCase();
    const amount = parseFloat(match[3].replace(',', '.'));
    const type = match[5]?.toLowerCase() === 'ontvangen' ? 'Inkomen' : 'Uitgave';
    const category = match[6];

    const months = {
      januari: '01', februari: '02', maart: '03', april: '04', mei: '05', juni: '06',
      juli: '07', augustus: '08', september: '09', oktober: '10', november: '11', december: '12'
    };
    const month = months[monthName];
    const year = new Date().getFullYear();
    const date = `${year}-${month}-${day.padStart(2, '0')}`;

    return {
      datum: date,
      bedrag: amount,
      categorie: category,
      type: type,
      beschrijving: category
    };
  };

  const handleSubmit = async () => {
    const data = parseInput(input);
    if (!data) {
      setStatus('Kon invoer niet begrijpen.');
      return;
    }
    try {
      const res = await fetch(WEBAPP_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setStatus('Toegevoegd aan Google Sheet ✅');
      } else {
        setStatus('Fout bij verzenden ❌');
      }
    } catch (err) {
      setStatus('Netwerkfout ❌');
    }
  };

  return (
    <div className="app">
      <h1>Financiële Chatbot</h1>
      <textarea
        placeholder="Bijv. Op 7 april 12,90 uitgegeven aan OV"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Verstuur</button>
      <p>{status}</p>
    </div>
  );
}

export default App;

