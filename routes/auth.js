const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// -------------------------------------------
// GET di test per verificare router
// -------------------------------------------
router.get("/test", (req, res) => {
  res.json({ message: "Auth router funzionante" });
});

// -------------------------------------------
// POST /auth/register  (REGISTRAZIONE AZIENDA)
// -------------------------------------------
router.post("/register", async (req, res) => {
  console.log("POST /auth/register body ricevuto:", req.body);

  try {
    const { email, password, azienda_id } = req.body;
    if (!email || !password || !azienda_id) {
      return res.status(400).json({
        error: "Email, password e azienda_id sono obbligatori."
      });
    }

    console.log("Dati estratti:", email, password, azienda_id);

    // 1️⃣ Creazione utente su Supabase Auth
    const { data: signupData, error: signupError } = await supabase.auth.signUp({ email, password });
    console.log("signupData:", signupData);
    console.log("signupError:", signupError);

    if (signupError) {
      return res.status(400).json({ error: signupError.message });
    }

    const supabase_id = signupData.user.id;

    // 2️⃣ Inserimento nella tabella users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          supabase_id,
          role: "azienda",
          azienda_id
        }
      ])
      .select();
    
    console.log("userData:", userData);
    console.log("userError:", userError);

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    return res.status(201).json({
      message: "Registrazione completata con successo",
      supabase_id
    });

  } catch (err) {
    console.error("Errore registrazione:", err);
    return res.status(500).json({
      error: "Errore durante la registrazione",
      dettagli: err.message
    });
  }
});

module.exports = router;
