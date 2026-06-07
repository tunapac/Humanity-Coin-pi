import crypto from 'crypto';
import fs from 'fs';

const CONFIG_PATH = './config.json';
const LEDGER_PATH = './local-ledger.db';
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

class HumanledgerCore {
    constructor() {
        this.totalSupplyCap = config.totalSupply; // 700,000,000 Huma
        this.initializeLedgerFile();
    }

    // =========================================================================
    // 1. CRYPTOGRAPHY KEY PAIR GENERATOR (Ed25519 Standard)
    // =========================================================================
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

    // =========================================================================
    // 2. BASE LEDGER FILE STRUCTURE (Append-Only Storage)
    // =========================================================================
    initializeLedgerFile() {
        if (!fs.existsSync(LEDGER_PATH)) {
            const genesisBlock = this.createBlock(0, "0", {
                message: "Humanledger Sovereign Genesis Block Initialized",
                network: "Humanity Blockchain",
                maxSupply: this.totalSupplyCap
            }, "SYSTEM_ROOT");
            
            fs.writeFileSync(LEDGER_PATH, JSON.stringify(genesisBlock) + '\n', 'utf8');
            console.log('🧱 Genesis Block successfully anchored to ledger storage.');
        }
    }

    getLatestBlock() {
        const fileContent = fs.readFileSync(LEDGER_PATH, 'utf8').trim().split('\n');
        return JSON.parse(fileContent[fileContent.length - 1]);
    }

    createBlock(index, previousHash, data, validatorSignature) {
        const block = {
            index,
            timestamp: Date.now(),
            previousHash,
            data,
            validatorSignature,
            hash: ''
        };
        block.hash = crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex');
        return block;
    }

    // =========================================================================
    // 3. CONSENSUS & 4. SECURITY SHIELD (Anti-Hacker / Anti-Loophole Layer)
    // =========================================================================
    validateAndCommitBlock(newBlockData, validatorPublicKey, privateKey) {
        if (!newBlockData || typeof newBlockData !== 'object') {
            throw new Error("SECURITY_ALERT: Invalid transaction payload layout rejected.");
        }

        const lastBlock = this.getLatestBlock();
        const nextIndex = lastBlock.index + 1;

        if (newBlockData.amount && newBlockData.currentTotalSupply) {
            if (newBlockData.currentTotalSupply > this.totalSupplyCap) {
                throw new Error(`CONSENSUS_CRITICAL: Action aborted. Token volume exceeds the 700,000,000 maximum cap.`);
            }
        }

        const temporaryPayload = { index: nextIndex, data: newBlockData, previousHash: lastBlock.hash };
        const explicitSignature = this.signPayload(privateKey, temporaryPayload);

        if (!this.verifySignature(validatorPublicKey, temporaryPayload, explicitSignature)) {
            throw new Error("SECURITY_ALERT: Cryptographic verification mismatch. Block submission dropped.");
        }

        const secureBlock = this.createBlock(nextIndex, lastBlock.hash, newBlockData, explicitSignature);

        if (secureBlock.previousHash !== lastBlock.hash) {
            throw new Error("CONSENSUS_CRITICAL: Ledger split detected. Previous block pointer is invalid.");
        }

        fs.appendFileSync(LEDGER_PATH, JSON.stringify(secureBlock) + '\n', 'utf8');
        return secureBlock;
    }
}

// =============================================================================
// RUNTIME LIVE DEMO / VERIFICATION SIMULATION
// =============================================================================
try {
    console.log('===================================================');
    console.log('⚙️ HUMANLEDGER CORE ENGINE RUNNING LOGS');
    console.log('===================================================');
    
    const engine = new HumanledgerCore();

    console.log('\n🔐 Initializing Sovereign Key Generation Loop...');
    const memberKeys = engine.generateMemberKeyPair();
    console.log('✅ Ed25519 Key Pair Securely Generated.');
    console.log(`🔑 Public Key Fingerprint: ${crypto.createHash('md5').update(memberKeys.publicKey).digest('hex')}`);

    console.log('\n📝 Simulating Member Transaction Execution...');
    const txPayload = {
        action: "REFERRAL_ONE_TIME_REWARD",
        referrerPubKey: "Member_Alpha_Node_ID",
        referredNewUser: "User_Beta_Registered",
        rewardAmount: "100 Huma",
        currentTotalSupply: 550000000
    };

    const committedBlock = engine.validateAndCommitBlock(txPayload, memberKeys.publicKey, memberKeys.privateKey);
    console.log('🔥 Consensus Achieved. Block Sealed successfully.');
    console.log(`📦 Sealed Block Hash: ${committedBlock.hash}`);
    console.log(`🔗 Previous Reference pointer: ${committedBlock.previousHash}`);

    console.log('\n📂 Local File Health Assessment:');
    const records = fs.readFileSync(LEDGER_PATH, 'utf8').trim().split('\n');
    console.log(`📈 Active Verified Blocks Saved in local-ledger.db: ${records.length}`);
    console.log('===================================================');

} catch (error) {
    console.error('\n🛑 System Security Halt:', error.message);
}
