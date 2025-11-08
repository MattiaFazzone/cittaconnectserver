// index.js – versione iniziale con "contenuto"

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "SOSTITUISCI_CON_TUO_URL_SUPABASE";
const SUPABASE_ANON_KEY = "SOSTITUISCI_CON_TUA_ANON_KEY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint per recuperare le aziende
app.get("/aziende", async (req, res) => {
  try {
    const { data, error } = await supabase.from("aziende").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Errore aziende:", err.message);
    res.status(500).json({ error: "Errore nel recupero aziende" });
  }
});

// Endpoint per recuperare le comunicazioni
app.get("/comunicazioni", async (req, res) => {
  try {
    const { data, error } = await supabase.from("comunicazioni").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Errore comunicazioni:", err.message);
    res.status(500).json({ error: "Errore nel recupero comunicazioni" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server CittaConnect attivo sulla porta ${PORT}`);
});

