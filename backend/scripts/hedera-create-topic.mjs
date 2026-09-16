/**
 * Create the Hedera HCS topic that GlobalPay anchors settlement proofs to.
 * One-time setup — print the topic ID and put it in backend/.env as
 * HEDERA_HCS_TOPIC_ID.
 *
 *   cd backend && node scripts/hedera-create-topic.mjs
 *
 * Requires in backend/.env:
 *   HEDERA_ACCOUNT_ID=0.0.x        (testnet account, faucet: https://portal.hedera.com/faucet)
 *   HEDERA_PRIVATE_KEY=xxxx        (ECDSA private key for that account)
 */

import 'dotenv/config';
import { Client, PrivateKey, TopicCreateTransaction } from '@hiero-ledger/sdk';

const ACCOUNT_ID = process.env.HEDERA_ACCOUNT_ID;
const PRIVATE_KEY = process.env.HEDERA_PRIVATE_KEY;
const NETWORK = process.env.HEDERA_NETWORK || 'testnet';

if (!ACCOUNT_ID || !PRIVATE_KEY) {
  console.error('Missing HEDERA_ACCOUNT_ID / HEDERA_PRIVATE_KEY in backend/.env');
  console.error('Get a free testnet account (takes ~1 min): https://portal.hedera.com/faucet');
  process.exit(1);
}

const client = Client.forName(NETWORK === 'mainnet' ? 'mainnet' : 'testnet')
  .setOperator(ACCOUNT_ID, PrivateKey.fromStringECDSA(PRIVATE_KEY));

const tx = await new TopicCreateTransaction()
  .setTopicMemo('GlobalPay settlement proofs — KeeperHub rail (Base Sepolia) | machine-to-human audit trail')
  .execute(client);

const receipt = await tx.getReceipt(client);
const topicId = receipt.topicId.toString();

console.log('\n✅ HCS topic created on Hedera', NETWORK);
console.log('   Topic ID:', topicId);
console.log(`   Audit trail: https://hashscan.io/${NETWORK}/topic/${topicId}`);
console.log('\nAdd to backend/.env:');
console.log(`HEDERA_ACCOUNT_ID=${ACCOUNT_ID}`);
console.log(`HEDERA_PRIVATE_KEY=<your key, already set>`);
console.log(`HEDERA_HCS_TOPIC_ID=${topicId}`);
console.log(`HEDERA_NETWORK=${NETWORK}`);
process.exit(0);
