const express = require("express");
const bodyParser = require("body-parser");
const PlayFab = require("playfab-sdk");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

PlayFab.settings.titleId = process.env.PLAYFAB_TITLE_ID;
PlayFab.settings.developerSecretKey = process.env.PLAYFAB_SECRET_KEY;

app.post("/api/premia", (req, res) => {
  const { PlayFabId, amount } = req.body;

  const request = {
    PlayFabId,
    VirtualCurrency: "GO",
    Amount: amount || 5
  };

  PlayFab.Admin.AddUserVirtualCurrency(request, (error, result) => {
    if (error) {
      console.error("Errore PlayFab:", error);
      return res.status(500).json({ success: false, error });
    }

    res.json({
      success: true,
      balance: result.data.Balance
    });
  });
});

app.get("/", (req, res) => {
  res.send("✅ Funzione PremiaGiocatore attiva.");
});

app.listen(port, () => {
  console.log(`🚀 Server attivo sulla porta ${port}`);
});
