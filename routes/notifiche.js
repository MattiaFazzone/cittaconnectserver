const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://wiwftbiibgzouqbvvajd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpd2Z0YmlpYmd6b3VxYnZ2YWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjEzOTYsImV4cCI6MjA3ODA5NzM5Nn0.6oWdPCGOc6qjXFoUA8fWkhuKdLXH7k_NQTD4hIsAH_s";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Endpoint per notifiche aggregate
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("comunicazioni")
      .select(`
        id,
        titolo,
        contenuto,
        data_pubblicazione,
        azienda_id,
        settore,
        aziende (
          nome,
          settore,
          "città"
        )
      `)
      .order("data_pubblicazione", { ascending: true });

    if (error) throw error;

    const notificheAggregate = {
      9: [],
      12: [],
      15: [],
      18: [],
    };

    data.forEach((n) => {
      const dataPub = new Date(n.data_pubblicazione);
      const ora = dataPub.getHours();

      if (ora >= 18) return; // Escludi comunicazioni dopo le 18

      let fascia;
      if (ora < 9) fascia = 9;
      else if (ora < 12) fascia = 12;
      else if (ora < 15) fascia = 15;
      else fascia = 18;

      notificheAggregate[fascia].push({
        id: n.id,
        titolo: n.titolo,
        contenuto: n.contenuto,
        data_pubblicazione: n.data_pubblicazione,
        azienda: n.aziende?.nome || "Azienda sconosciuta",
        settore: n.settore || "Altro",
        citta: n.aziende?.["città"] || "Città non disponibile"
      });
    });

    res.json(notificheAggregate);
  } catch (err) {
    console.error("Errore notifiche:", err.message);
    res.status(500).json({ error: "Errore nel recupero notifiche" });
  }
});

module.exports = router;
