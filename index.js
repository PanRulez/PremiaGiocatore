const express = require("express");
const bodyParser = require("body-parser");
const PlayFab = require("playfab-sdk");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// 🔐 Configura le credenziali PlayFab dalle variabili ambiente
PlayFab.settings.titleId = process.env.PLAYFAB_TITLE_ID;
PlayFab.settings.developerSecretKey = process.env.PLAYFAB_SECRET_KEY;

// 📤 Endpoint POST /api/premia
app.post("/api/premia", (req, res) => {
  const { PlayFabId, amount } = req.body;

  if (!PlayFabId) {
    return res.status(400).json({ success: false, message: "PlayFabId mancante" });
  }

  const request = {
    PlayFabId,
    VirtualCurrency: "GO", // cambia se usi un altro codice valuta
    Amount: amount || 5
  };

  PlayFab.Admin.AddUserVirtualCurrency(request, (error, result) => {
    if (error) {
      console.error("❌ Errore PlayFab:", error);
      return res.status(500).json({ success: false, error });
    }

    console.log("✅ Monete aggiunte:", result.data.Balance);
    res.json({ success: true, balance: result.data.Balance });
  });
});

// 🔍 Endpoint GET /
app.get("/", (req, res) => {
  res.send("✅ Funzione PremiaGiocatore attiva.");
});

app.listen(port, () => {
  console.log(`🚀 Server attivo sulla porta ${port}`);
});
