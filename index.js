// index.js
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// Variabili di ambiente
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Connessione a Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Server Express
const app = express();
app.use(cors());
app.use(express.json());

// Porta
const PORT = process.env.PORT || 3000;

// Endpoint per ottenere tutte le aziende
app.get("/aziende", async (req, res) => {
  try {
    const { data, error } = await supabase.from("aziende").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel recupero delle aziende" });
  }
});

// Endpoint per ottenere tutte le comunicazioni
app.get("/comunicazioni", async (req, res) => {
  try {
    const { data, error } = await supabase.from("comunicazioni").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel recupero delle comunicazioni" });
  }
});

// Avvio server
app.listen(PORT, () => {
  console.log(`Server CittaConnect attivo e funzionante su porta ${PORT}`);
});

