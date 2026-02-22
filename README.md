# Digital Susu  
### A Blockchain-Powered Rotating Savings Platform Built on XRPL

Digital Susu modernizes traditional rotating savings systems (Susu / Esusu / Tanda / Chit Fund) using blockchain escrow technology.

Built on the XRP Ledger (XRPL), this MVP demonstrates how decentralized escrow logic can power transparent, automated, and trust-minimized community savings.

---
# 🌍 Market Opportunity — Centered on Black Communities

Rotating savings systems are deeply rooted in Black communities worldwide.

Known as:
- **Susu** (West Africa & Caribbean)
- **Esusu**
- **Pardner**
- **Partner hand**
- **Tanda**
- **Chit funds**

These systems have historically:

- Circulated wealth within Black communities
- Provided access to capital when banks excluded us
- Funded businesses, homes, education, and migration
- Built trust-based financial networks across generations

Today:

- Over 1 billion people globally participate in rotating savings systems
- They are especially vital in underbanked and historically excluded communities
- Black diaspora communities rely on them for entrepreneurship and survival
- They represent billions in informal economic power annually

Yet these systems remain:

- Informal
- Vulnerable to fraud or organizer risk
- Difficult to scale digitally
- Limited by geography

---

# Financial Inclusion for the Black Diaspora

Black communities globally face:

- Lower banking access rates
- Higher remittance costs
- Limited access to startup capital
- Systemic lending discrimination
- Wealth gaps driven by structural barriers

Rotating savings groups have always been a solution created by the community.

Digital Susu upgrades that solution with:

- Transparency
- Automation
- Security
- Scalability
- Global reach

This bridges traditional Black community finance with decentralized financial infrastructure.

---

# Bigger Vision

Digital Susu is not just an app.
Digital Susu aims to:

- Reduce fraud risk through blockchain escrow
- Automate savings cycles
- Enable transparent contribution tracking
- Support cross-border participation
- Create scalable fintech infrastructure for community finance
This is about using modern technology to strengthen a legacy financial system that has empowered Black communities for generations.


# Core Concept

Instead of relying on a trusted group leader:

1. Participants deposit funds.
2. Funds are locked in XRPL escrow.
3. Time-based logic controls release.
4. Funds unlock only when rules are met.

The blockchain becomes the neutral trusted party.

---

# MVP Features

## Wallet Creation (XRPL Testnet)
- Generate funded XRPL wallets
- No external setup required
- Blockchain-backed accounts

## Escrow-Based Deposits
- Deposit XRP into escrow
- 60-second lock period (demo)
- Multiple deposits supported

## Live Countdown Per Deposit
- Real-time timer per escrow
- Status changes:
  - Pending → Ready → Released

## Controlled Release
- Release button activates only after countdown
- Executes XRPL `EscrowFinish` transaction

---

# Architecture

## Frontend
- HTML
- CSS (Flexbox layout)
- Vanilla JavaScript (ES Modules)

## Backend
- Node.js
- Express
- XRPL JavaScript SDK

## Blockchain Layer
- XRP Ledger Testnet
- EscrowCreate transactions
- EscrowFinish transactions

---

# How It Works

### 1. Create Wallet
User creates a funded XRPL test wallet.

### 2. Deposit
User enters wallet seed and deposits XRP into escrow.

### 3. Lock Period
Funds are locked for 60 seconds.

### 4. Release
After countdown expires, release is enabled and escrow is finished.

All transactions are verifiable on-chain.

---

# Why XRPL?

XRPL provides:

- Fast settlement (~3–5 seconds)
- Very low transaction fees
- Native escrow functionality
- High reliability
- Energy-efficient infrastructure

Ideal for micro-savings and community finance applications.

---

# Competitive Advantage

| Traditional Susu | Digital Susu |
|------------------|--------------|
| Requires trusted leader | Trust minimized via blockchain |
| Manual tracking | Automated tracking |
| Fraud risk | Cryptographic enforcement |
| Local participation | Borderless participation |
| Delayed payouts | Time-programmed release |

---

# Security Notice

 This is a Testnet MVP.

- Seeds are stored temporarily in memory
- No database persistence
- No authentication system
- Not production ready

Do NOT use mainnet funds.

---

# Roadmap

### Phase 1 – Infrastructure
- Database integration
- User accounts
- Group creation logic

### Phase 2 – Smart Rotation Engine
- Automatic payout scheduling
- Contribution enforcement
- Credit scoring layer

### Phase 3 – Production
- XRPL Mainnet deployment
- Mobile-first UI
- Fiat on/off ramp integration

---

# Project Structure

```
project-root/
│
├── server.js
├── package.json
├──public.html
├──script.js
└── README.md
```

---

## Installation

Prerequisites
- Node.js v16+ and npm
- Git

Quick install and run (macOS)

```bash
# clone the repo
git clone git@github.com:Lancy06/digital-susu.git
cd digital-susu

# install dependencies
npm install

# start the server
node server.js

# open the app
# in your browser:
http://localhost:3000
```

Notes
- The app uses the XRPL Testnet. Do NOT use mainnet seeds/funds.
- If you see "Cannot GET /" ensure server.js is running and serving public.html (server.js included in repo).
- If you want automatic restarts during development, install nodemon: npm install -g nodemon && nodemon server.js
- Recommended: set NODE_ENV=development when working locally.

Troubleshooting
- "Authentication failed" when pushing to GitHub: use SSH or a Personal Access Token (PAT).
- "zsh: command not found: brew" — Homebrew not installed; not required to run
---

# What This MVP Demonstrates

- Escrow-based savings logic
- Time-controlled blockchain release
- Multi-deposit handling
- Real-time countdown UX
- Blockchain transaction integration

This validates the feasibility of decentralized rotating savings infrastructure.

---

# License

MIT License

---

# Our Mission

Digital Susu brings programmable trust to traditional community finance — unlocking inclusive, borderless savings powered by blockchain.
