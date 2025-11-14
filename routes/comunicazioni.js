const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /comunicazioni
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('comunicazioni')
      .select(`
        id,
        titolo,
        contenuto,
        data_pubblicazione,
        settore,
        citta,
        aziende (
          id,
          nome,
          citta,
          logo_url
        )
      `)
      .order('data_pubblicazione', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Errore GET comunicazioni:", err.message);
    res.status(500).json({ error: "Errore nel recupero comunicazioni" });
  }
});

// POST /comunicazioni
router.post('/', async (req, res) => {
  try {
    const { titolo, contenuto, azienda_id, settore, citta } = req.body;

    if (!titolo || !contenuto || !azienda_id || !citta) {
      return res.status(400).json({
        error: "Titolo, contenuto, azienda_id e citta sono obbligatori."
      });
    }

    const nuovaComunicazione = {
      titolo,
      contenuto,
      azienda_id,
      settore: settore || null,
      citta
    };

    const { data, error } = await supabase
      .from('comunicazioni')
      .insert([nuovaComunicazione])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "Comunicazione creata con successo",
      comunicazione: data[0]
    });
  } catch (err) {
    console.error("Errore POST comunicazioni:", err.message);
    res.status(500).json({ error: "Errore durante la creazione" });
  }
});

module.exports = router;
