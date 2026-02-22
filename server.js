// ---------------------------
// Required modules
// ---------------------------
const fetch = require("node-fetch")      // For xrpl fundWallet in Node
global.fetch = fetch

const express = require('express');
const path = require('path');
const xrpl = require('xrpl');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------
// XRPL client (Testnet)
// ---------------------------
const client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');

app.use(express.static(path.join(__dirname)));
app.use(express.json()); // parse JSON request bodies

// Serve public.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public.html'));
});

// ---------------------------
// Start server
// ---------------------------
app.listen(PORT, () => {
  console.log(`Server listening: http://localhost:${PORT}`);
});

// ---------------------------
// Connect to XRPL
// ---------------------------
let wallets = []
let escrows = []

async function connect() {
  await client.connect()
  console.log("Connected to XRPL Testnet")
}
connect()

// ---------------------------
// Create wallet
// ---------------------------
app.post("/create-wallet", async (req, res) => {
  const fund = await client.fundWallet()
  wallets.push(fund.wallet)
  res.json({
    address: fund.wallet.address,
    seed: fund.wallet.seed
  })
})

// ---------------------------
// Deposit (Escrow)
// ---------------------------
app.post("/deposit", async (req, res) => {
  const { seed, amount } = req.body
  const wallet = xrpl.Wallet.fromSeed(seed)

  const escrowTx = {
    TransactionType: "EscrowCreate",
    Account: wallet.address,
    Destination: wallet.address,
    Amount: xrpl.xrpToDrops(amount),
    FinishAfter: Math.floor(Date.now() / 1000) + 60 // 60 seconds
  }

  const prepared = await client.autofill(escrowTx)
  const signed = wallet.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)

  escrows.push(result.result.tx_json.Sequence)

  res.json({ status: "Escrow Created", result })
})

// ---------------------------
// Release escrow
// ---------------------------
app.post("/release", async (req, res) => {
  const { seed, owner, sequence } = req.body
  const wallet = xrpl.Wallet.fromSeed(seed)

  const finishTx = {
    TransactionType: "EscrowFinish",
    Account: wallet.address,
    Owner: owner,
    OfferSequence: sequence
  }

  const prepared = await client.autofill(finishTx)
  const signed = wallet.sign(prepared)
  const result = await client.submitAndWait(signed.tx_blob)

  res.json({ status: "Released", result })
})

// ---------------------------
// Get wallet info from seed
// ---------------------------
app.post("/wallet-info", (req, res) => {
  const { seed } = req.body
  if (!seed) return res.status(400).json({ error: "Seed required" })

  try {
    const wallet = xrpl.Wallet.fromSeed(seed)
    res.json({ address: wallet.address })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Invalid seed" })
  }
})