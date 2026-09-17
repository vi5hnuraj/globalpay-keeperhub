# GlobalPay

**Agent commerce, settled deterministically through KeeperHub.**

GlobalPay is a platform where AI agents discover, purchase, and consume digital services — and every USDC settlement is executed by [KeeperHub](https://keeperhub.com) as the deterministic execution rail. Agents are probabilistic; value transfer is not. GlobalPay's answer: an agent composes a settlement workflow, a human reviews the exact calls, the workflow is dry-run against the chain without touching it, and then *that exact workflow* executes through KeeperHub. Nothing is inferred at execution time.

> Built for **KeeperHub — The Agent Economy Hackathon** (DoraHacks, Sep 2026).

---

## What it does

```
Agent picks a service → Trust Engine + procurement policy gate the purchase
        ↓
Workflow composed (approve → settle → release on the Payment Manager)
        ↓
Human reviews every call (contract, function, args — nothing hidden)
        ↓
Dry run via KeeperHub MCP (wouldRevert + gas estimate, zero chain state)
        ↓
KeeperHub executes the exact reviewed workflow (Turnkey org wallet signs)
        ↓
Receipts anchored to Hedera HCS — two public ledgers agree
```

- **Marketplace** — live AI services (document analysis, inference, geo-verification) with real HTTP endpoints; purchases are health-gated, so dead providers are refused at compose time.
- **Agent wallets** — non-custodial Privy server wallets, one per agent, funded in USDC.
- **Trust Engine** — evidence-based provider scoring from indexed settlement history (The Graph), surfaced conversationally through an AI assistant.
- **Workflow Studio** — the full loop above as a clickable screen: compose → review → dry run → chaos probe (tampered workflows are refused in simulation) → execute → prove.
- **Proof layer** — every purchase writes HELD / DELIVERED / RELEASED anchors to a public Hedera consensus topic; anyone can verify them on a mirror node without trusting this server.

## KeeperHub integration

| Surface | How it's used |
|---|---|
| **MCP server** | Dry-run simulation + broadcast of every settlement call (`dry_run_contract_call`, `execute_contract_call`) |
| **Agent-authored workflows** | Composed, human-reviewed, then executed verbatim — no inference at execution time |
| **Audit trail** | Per-run receipts, additionally anchored to a public ledger |

Chain: **Base Sepolia** (USDC ERC-20 + ETH gas), settled through KeeperHub's hosted infrastructure — nonce management, gas estimation, retries and MEV-aware routing stay on their side.

## Tech stack

- **Backend:** Node.js (ESM), Express, Supabase, Privy Server Wallets, ethers v6
- **Frontend:** React 19 + Vite, Reown AppKit
- **Contracts:** `GlobalPayManager` (prepaid escrow: approve → settle → release) — deployed on Base Sepolia
- **Proof:** Hedera HCS via `@hashgraph/sdk` (public topic + mirror node reads)
- **Rail:** KeeperHub MCP (`EXECUTION_RAIL=keeperhub`; a direct-rail fallback exists for local dev)

## Quick start

```bash
# backend
cd backend
cp .env.example .env        # fill in keys (see .env.example for each)
npm install
npm start                   # → http://localhost:5550

# client
cd client
cp .env.example .env        # VITE_SUPABASE_URL, VITE_RPC_URL, wallet project id
npm install
npm run dev                 # → http://localhost:5173
```

Scripts worth reading (they run the real flow against the live API):

```bash
node scripts/keeperhub-smoke.js        # MCP handshake + dry-run + chaos refusal
node scripts/workflow-studio-e2e.js    # full compose → dry-run → execute → prove run
node scripts/hedera-create-topic.mjs   # one-time: create the HCS proof topic
```

## Environment

Everything is configured via `.env` (both `backend/.env.example` and `client/.env.example` document every variable). Key groups:

- `SUPABASE_*` — database (service role stays server-side)
- `KEEPERHUB_API_KEY` — org API key from app.keeperhub.com
- `PRIVY_APP_ID` / `PRIVY_APP_SECRET` — agent wallet custody
- `HEDERA_ACCOUNT_ID` / `HEDERA_PRIVATE_KEY` / `HEDERA_HCS_TOPIC_ID` — proof layer
- `GLOBAL_PAY_MANAGER_ADDRESS` — deployed escrow contract on Base Sepolia

No secrets are committed; `.env` is gitignored.

## What's still rough (honest list)

- Supabase's `sb_secret_` key gateway intermittently degrades service-role sessions to anon; a retry layer absorbs most cases and settlement bookkeeping is deliberately non-fatal (chain settlement never rolls back).
- Scheduled payments created on the deprecated Arc testnet cannot decode against the Base Payment Manager.
- Agent wallets hold USDC but no gas ETH — direct agent-signed sends are blocked with a clear error (the KeeperHub rail pays gas from the org wallet).
- Launched during the hackathon: live and running, but judges are effectively the first external users.

## Submission links

- **Demo:** Workflow Studio at `/developer/studio` — one click per stage, ~30 seconds end to end
- **Settlement tx (Base Sepolia):** settle step of a real purchase — `0x4fc9efbc9c9b022c5e6830ceec4c6a0ac56c5add9183c0313511d6b6bbbadec6` on sepolia.basescan.org
- **Public proof:** [hashscan.io/testnet/topic/0.0.10590142](https://hashscan.io/testnet/topic/0.0.10590142) — HELD / DELIVERED / RELEASED anchors with the Base tx hashes inside
- **Bounty PR:** [KeeperHub/keeperhub#2561](https://github.com/KeeperHub/keeperhub/pull/2561) — the `hedera` plugin (Submit/Verify HCS Message nodes) extracted from this project's proof layer

## License

MIT
