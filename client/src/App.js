import React, { useState } from 'react';
import './App.css';

const WEBAPP_URL = 'https://finance-chatbot-backend.onrender.com/proxy';

function App() {
  // Zet de datum standaard op vandaag (yyyy-mm-dd)
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Controleer of bedrag en categorie geldig zijn
    if (!amount || isNaN(parseFloat(amount)) || !category) {
      setStatus("Voer een geldig bedrag en een categorie in.");
      return;
    }

    const data = {
      datum: date,
      bedrag: parseFloat(amount),
      categorie: category,
      type: "Uitgave",        // Alle invoer wordt als 'Uitgave' geregistreerd
      beschrijving: category
    };

    try {
      const res = await fetch(WEBAPP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setStatus("Toegevoegd aan Google Sheet ✅");
        // Reset de velden na succesvolle verzending
        setAmount('');
        setCategory('');
        setDate(today);
      } else {
        setStatus("Fout bij verzenden ❌");
      }
    } catch (error) {
      setStatus("Netwerkfout ❌");
    }
  };

  return (
    <div className="app">
      <div className="card">
        <div className="card-header">
          <h1>Financiële Overzicht</h1>
          <p>Voer je dagelijkse uitgaven in</p>
        </div>
        <form onSubmit={handleSubmit} className="card-form">
          <div className="form-group">
            <label htmlFor="date">Datum</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Bedrag (€)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              placeholder="Bijv. 12.90"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Categorie</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Bijv. OV, Boodschappen, enz."
            />
          </div>
          <button type="submit">Verstuur</button>
        </form>
        {status && <p className="status">{status}</p>}
      </div>
    </div>
  );
}

export default App;
