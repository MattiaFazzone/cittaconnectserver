const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

// -----------------
// Supabase client
// -----------------
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// -----------------
// Express app
// -----------------
const app = express();

// 🔹 Log iniziale
console.log("index.js caricato correttamente Render-ready");

// Middleware base
app.use(cors());
app.use(express.json());

// 🔹 Logging di tutte le richieste HTTP
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// -----------------
// Route root test
// -----------------
app.get("/", (req, res) => {
  res.json({ message: "Server Render funzionante sul root" });
});

// -----------------
// Route /auth
// -----------------
const authRoute = require("./routes/auth");
app.use("/auth", authRoute);

// -----------------
// Route /comunicazioni
// -----------------
const comunicazioniRoutes = require("./routes/comunicazioni");
app.use("/comunicazioni", comunicazioniRoutes);

// -----------------
// Route /notifiche
// -----------------
const notificheRoutes = require("./routes/notifiche");
app.use("/notifiche", notificheRoutes);

// -----------------
// Porta dinamica Render
// -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server CittaConnect attivo sulla porta ${PORT}`);
  console.log(`process.env.PORT = ${process.env.PORT || 'non definita (locale)'}`);
});
