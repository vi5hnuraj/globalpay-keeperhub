# GlobalPay Payment Manager Subgraph

This subgraph indexes the deployed GlobalPay Payment Manager. The manifest
below still targets the deprecated Arc Testnet deployment; the active
settlement chain is Base Sepolia via the KeeperHub rail (update `network`
in `subgraph.yaml` and redeploy to index Base events).

```text
Contract: 0x775Ab463A19E51072C61bAe94A0931E00F7caa42
Network:  Arc Testnet
Chain ID: 5042002
Start:    block 60772639 (contract creation block)
```

## Commands

```bash
npm install
npm run codegen
npm run build
```

Deployment is intentionally not performed by this repository change. Configure
the Graph provider credentials and deployment slug before running `npm run deploy`.
