const express = require("express");
const bodyParser = require("body-parser");
const PlayFab = require("playfab-sdk/Scripts/PlayFab/PlayFab");
const PlayFabAdmin = require("playfab-sdk/Scripts/PlayFab/PlayFabAdmin");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// 🔐 Imposta credenziali PlayFab
PlayFab.settings.titleId = process.env.PLAYFAB_TITLE_ID;
PlayFab.settings.developerSecretKey = process.env.PLAYFAB_SECRET_KEY;

// 🌐 Endpoint GET semplice per test
app.get("/", (req, res) => {
  res.send("✅ Funzione PremiaGiocatore attiva.");
});

// 🪙 Endpoint POST per aggiungere monete
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

  PlayFabAdmin.AddUserVirtualCurrency(request, (error, result) => {
    if (error) {
      console.error("❌ Errore PlayFab:", error);
      return res.status(500).json({ success: false, error });
    }

    console.log("✅ Monete aggiunte:", result.data.Balance);
    return res.json({ success: true, balance: result.data.Balance });
  });
});

// 🟢 Avvio server
app.listen(port, () => {
  console.log(`🚀 Server attivo sulla porta ${port}`);
});

