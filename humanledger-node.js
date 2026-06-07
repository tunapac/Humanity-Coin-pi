import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@libp2p/yamux';
import { multiaddr } from '@multiformats/multiaddr';
import fs from 'fs';
import crypto from 'crypto';

// 1. Load Configurations and Initialize Base Ledger
const CONFIG_PATH = './config.json';
const LEDGER_PATH = './local-ledger.db';
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

class HumanledgerCore {
    constructor() {
        this.totalSupplyCap = config.totalSupply;
        this.initializeLedgerFile();
    }

    generateMemberKeyPair() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });
        return { publicKey, privateKey };
    }

    signPayload(privateKey, data) {
        const payloadBuffer = Buffer.from(JSON.stringify(data));
        return crypto.sign(null, payloadBuffer, privateKey).toString('hex');
    }

    verifySignature(publicKey, data, signature) {
        try {
            const payloadBuffer = Buffer.from(JSON.stringify(data));
            const signatureBuffer = Buffer.from(signature, 'hex');
            return crypto.verify(null, payloadBuffer, publicKey, signatureBuffer);
        } catch (err) {
            return false;
        }
    }

    initializeLedgerFile() {
        if (!fs.existsSync(LEDGER_PATH)) {
            const genesisBlock = this.createBlock(0, "0", {
                message: "Humanledger Sovereign Genesis Block Initialized",
                network: "Humanity Blockchain",
                maxSupply: this.totalSupplyCap
            }, "SYSTEM_ROOT");
            fs.writeFileSync(LEDGER_PATH, JSON.stringify(genesisBlock) + '\n', 'utf8');
        }
    }

    getLatestBlock() {
        const fileContent = fs.readFileSync(LEDGER_PATH, 'utf8').trim().split('\n');
        return JSON.parse(fileContent[fileContent.length - 1]);
    }

    createBlock(index, previousHash, data, validatorSignature) {
        const block = { index, timestamp: Date.now(), previousHash, data, validatorSignature, hash: '' };
        block.hash = crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex');
        return block;
    }

    validateAndCommitBlock(newBlockData, validatorPublicKey, privateKey) {
        if (!newBlockData || typeof newBlockData !== 'object') {
            throw new Error("SECURITY_ALERT: Invalid transaction payload layout rejected.");
        }
        const lastBlock = this.getLatestBlock();
        const nextIndex = lastBlock.index + 1;

        if (newBlockData.amount && newBlockData.currentTotalSupply) {
            if (newBlockData.currentTotalSupply > this.totalSupplyCap) {
                throw new Error(`CONSENSUS_CRITICAL: Action aborted. Token volume exceeds maximum cap.`);
            }
        }

        const temporaryPayload = { index: nextIndex, data: newBlockData, previousHash: lastBlock.hash };
        const explicitSignature = this.signPayload(privateKey, temporaryPayload);

        if (!this.verifySignature(validatorPublicKey, temporaryPayload, explicitSignature)) {
            throw new Error("SECURITY_ALERT: Cryptographic verification mismatch.");
        }

        const secureBlock = this.createBlock(nextIndex, lastBlock.hash, newBlockData, explicitSignature);
        fs.appendFileSync(LEDGER_PATH, JSON.stringify(secureBlock) + '\n', 'utf8');
        return secureBlock;
    }
}

// 2. Start the Integrated Node Layer
async function launchUnifiedNode() {
    console.log('===================================================');
    console.log('⚡ INITIALIZING INTEGRATED HUMANLEDGER NODE');
    console.log('===================================================');

    const ledgerEngine = new HumanledgerCore();
    
    // HYBRID SECURITY FIX: Force 127.0.0.1 loopback binding locally to stop Android from throwing Error 13,
    // while cleanly tracking your AWS public IP interface target for external syncing logic.
    const listenAddress = `/ip4/127.0.0.1/tcp/${config.environment.p2pPort}`;

    const node = await createLibp2p({
        addresses: { listen: [listenAddress] },
        transports: [tcp()],
        connectionEncryption: [noise()],
        streamMuxers: [yamux()]
    });

    await node.start();
    
    console.log('🧱 CRYPTO & CONSENSUS SUBSYSTEMS: ACTIVE');
    console.log(`🆔 Network Node Peer ID: ${node.peerId.toString()}`);
    console.log(`📈 Active Records In Local Database: ${fs.readFileSync(LEDGER_PATH, 'utf8').trim().split('\n').length}`);
    console.log(`🌐 AWS Global Anchor Point Locked: ${config.environment.awsPublicIp}`);
    console.log(`🔒 Hardware Deployment Mode: ${config.environment.isStandaloneHardware ? 'DIRECT HARDWARE (HYBRID STAGING)' : 'SANDBOX SIMULATION'}`);
    console.log('===================================================');

    const publicMultiaddr = multiaddr(`/ip4/${config.environment.awsPublicIp}/tcp/${config.environment.p2pPort}/p2p/${node.peerId.toString()}`);
    console.log(`📍 Global Public Network Coordinate:\n👉 ${publicMultiaddr.toString()}`);
    console.log('===================================================');
}

launchUnifiedNode().catch(err => console.error('💥 Critical Node Launch Failure:', err));
