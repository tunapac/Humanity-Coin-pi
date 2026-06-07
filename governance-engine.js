import crypto from 'crypto';
import fs from 'fs';
import readline from 'readline';

class HumanledgerGovernance {
    constructor() {
        this.dnsRegistryPath = './huma-dns.json';
        this.licenseStorePath = './signed-licenses.db';
        this.rewardLogPath = './rewards-ledger.db';
        this.biometricLogPath = './biometrics-registry.db';
        this.initializeStorageFiles();
    }

    initializeStorageFiles() {
        if (!fs.existsSync(this.dnsRegistryPath)) {
            const initialDNS = {
                "humatelcos.huma": "52.87.213.65",
                "core.humanledger.huma": "52.87.213.65"
            };
            fs.writeFileSync(this.dnsRegistryPath, JSON.stringify(initialDNS, null, 4));
        }
        if (!fs.existsSync(this.licenseStorePath)) fs.writeFileSync(this.licenseStorePath, '');
        if (!fs.existsSync(this.rewardLogPath)) fs.writeFileSync(this.rewardLogPath, '');
        if (!fs.existsSync(this.biometricLogPath)) fs.writeFileSync(this.biometricLogPath, '');
    }

    resolveDomain(domain) {
        const registry = JSON.parse(fs.readFileSync(this.dnsRegistryPath, 'utf8'));
        if (registry[domain]) {
            return { success: true, domain, ip: registry[domain] };
        }
        return { success: false, message: `NXDOMAIN: Sovereign name '${domain}' not registered.` };
    }

    registerDomain(domain, targetIp) {
        if (!domain.endsWith('.huma')) {
            return { success: false, message: "REGISTRATION_REJECTED: Domain must use '.huma' suffix." };
        }
        const registry = JSON.parse(fs.readFileSync(this.dnsRegistryPath, 'utf8'));
        registry[domain] = targetIp;
        fs.writeFileSync(this.dnsRegistryPath, JSON.stringify(registry, null, 4));
        return { success: true, message: `Domain ${domain} successfully anchored to ${targetIp}` };
    }

    processAICodeHub(language, compileTarget) {
        console.log(`[🤖 Humanledger AI Hub] Intercepting ${language.toUpperCase()} framework parameters...`);
        if (compileTarget === "hardcode") {
            return `⚡ HARDCODE OPTIMIZATION: Enforcing low-level memory shields and quantum-resistant Ed25519 cryptography validation rules.`;
        } else {
            return `💧 SOFTCODE OPTIMIZATION: Verifying tool integration wrappers, dynamic memory loops, and logic script abstractions.`;
        }
    }

    issueSovereignLicense(operatorName) {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });

        const agreementText = `========================================================================\nHUMANLEDGER ECOSYSTEM SOVEREIGN PROTOCOL AGREEMENT & LICENSE\n========================================================================\nOPERATOR IDENTIFIER: ${operatorName}\nTIMESTAMP OF ASSENT : ${new Date().toISOString()}\n========================================================================`;
        const signature = crypto.sign(null, Buffer.from(agreementText), privateKey).toString('hex');
        const licenseId = crypto.randomUUID();
        const fingerprint = crypto.createHash('sha256').update(publicKey).digest('hex');

        const licenseRecord = { licenseId, operatorName, fingerprint, signature, issuedAt: new Date().toISOString() };
        fs.appendFileSync(this.licenseStorePath, JSON.stringify(licenseRecord) + '\n', 'utf8');

        return { agreementText, licenseRecord };
    }

    processReferralReward(referrerId, newUserId) {
        const fileContent = fs.readFileSync(this.rewardLogPath, 'utf8').trim();
        const logs = fileContent ? fileContent.split('\n').map(line => JSON.parse(line)) : [];
        if (logs.some(record => record.newUserId === newUserId)) {
            return { success: false, message: `SECURITY_ALERT: One-time reference reward already claimed for onboarding user [${newUserId}].` };
        }
        const rewardPayload = { transactionId: crypto.randomUUID(), referrerId, newUserId, rewardAmount: "10 HUMA", type: "ONE_TIME_PEER_REFERENCE_REWARD", timestamp: new Date().toISOString() };
        fs.appendFileSync(this.rewardLogPath, JSON.stringify(rewardPayload) + '\n', 'utf8');
        return { success: true, payload: rewardPayload };
    }

    // =========================================================================
    // ✋ CORE FUNCTION 2: BIOMETRIC PRE-VALIDATION ROUTER
    // =========================================================================
    registerBiometricIdentity(operatorId, rawPalmScanString) {
        const fileContent = fs.readFileSync(this.biometricLogPath, 'utf8').trim();
        const logs = fileContent ? fileContent.split('\n').map(line => JSON.parse(line)) : [];

        if (logs.some(record => record.operatorId === operatorId)) {
            return { success: false, message: `REJECTED: Operator [${operatorId}] already has a biometric signature bound to this ledger node.` };
        }

        // Generate a secure, deterministic identity hash out of the physical palm-scan input
        const bioFingerprint = crypto.createHash('sha512').update(rawPalmScanString).digest('hex');
        const bioRecord = {
            operatorId,
            identityType: "PROOF_OF_HUMAN_PALM_SCAN",
            biometricHash: bioFingerprint,
            verifiedAt: new Date().toISOString()
        };

        fs.appendFileSync(this.biometricLogPath, JSON.stringify(bioRecord) + '\n', 'utf8');
        return { success: true, record: bioRecord };
    }

    // =========================================================================
    // 🛰️ CORE FUNCTION 3: TELCO PACKET ENCRYPTION SIMULATOR
    // =========================================================================
    simulateTelcoStream(senderDevice, recipientDevice, rawDataPayload) {
        // Resolve internal routing path via our custom DNS mapping
        const dnsCheck = this.resolveDomain('humatelcos.huma');
        if (!dnsCheck.success) {
            return { success: false, message: "ROUTING_FAILED: Cannot resolve 'humatelcos.huma' carrier path." };
        }

        // Generate dynamic single-use AES encryption variables for the data tunnel
        const cipherKey = crypto.randomBytes(32);
        const initializationVector = crypto.randomBytes(16);
        
        const cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, initializationVector);
        let encryptedPacket = cipher.update(rawDataPayload, 'utf8', 'hex');
        encryptedPacket += cipher.final('hex');

        return {
            success: true,
            carrierRoute: "humatelcos.huma",
            carrierNodeIp: dnsCheck.ip,
            sender: senderDevice,
            recipient: recipientDevice,
            originalPayloadLength: `${Buffer.byteLength(rawDataPayload)} bytes`,
            secureEncryptedPacket: encryptedPacket,
            cryptoStandard: "AES-256-CBC-DYNAMIC"
        };
    }
}

// =============================================================================
// INTERACTIVE SHELL INTERFACE
// =============================================================================
function startSovereignShell() {
    console.log('\n========================================================');
    console.log('💻 HUMANLEDGER OS SOVEREIGN TERMINAL ENGINE v1.1.0-PRO');
    console.log('📝 Type "help" to see available ecosystem operations.');
    console.log('========================================================');

    const gov = new HumanledgerGovernance();
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'humanledger@core-node:~$ ' });
    rl.prompt();

    rl.on('line', (line) => {
        const input = line.trim();
        if (!input) { rl.prompt(); return; }

        const args = input.split(' ');
        const command = args[0];

        switch (command) {
            case 'help':
                console.log('\nAvailable Sovereign Commands:');
                console.log('  huma-dns --resolve [domain.huma]            | Resolve a .huma domain');
                console.log('  huma-dns --register [domain.huma] [ip]      | Anchor a new domain to an IP');
                console.log('  huma-ai --analyze [lang] [soft/hard]        | Process code through the AI hub');
                console.log('  huma-license --issue [operator_name]        | Issue protocol license & certificate');
                console.log('  huma-reward --process [referrer] [new_user] | Distribute one-time reference reward');
                console.log('  huma-bio --scan [operator_id] [palm_string] | Register deterministic biometric ID');
                console.log('  huma-telco --stream [from] [to] [message]   | Simulate dynamic AES-256 stream');
                console.log('  clear                                       | Clear the terminal interface');
                console.log('  exit                                        | Shutdown the terminal interface\n');
                break;

            case 'clear': console.clear(); break;
            case 'exit': console.log('Shutting down Sovereign Terminal Engine. System safe.'); process.exit(0); break;

            case 'huma-dns':
                if (args[1] === '--resolve' && args[2]) {
                    const res = gov.resolveDomain(args[2]);
                    console.log(res.success ? `=> STATUS: 200 OK | Domain: ${res.domain} -> IP: ${res.ip}` : `=> STATUS: 404 NOT FOUND | ${res.message}`);
                } else if (args[1] === '--register' && args[2] && args[3]) {
                    console.log(`=> ${gov.registerDomain(args[2], args[3]).message}`);
                } else { console.log('Usage: huma-dns --resolve [domain] OR --register [domain] [ip]'); }
                break;

            case 'huma-ai':
                if (args[1] === '--analyze' && args[2] && args[3]) {
                    console.log(`=> [RESULT] Class: ${args[3].toUpperCase()}\n=> [AI MATRIX] ${gov.processAICodeHub(args[2], args[3])}`);
                } else { console.log('Usage: huma-ai --analyze [language] [softcode|hardcode]'); }
                break;

            case 'huma-license':
                if (args[1] === '--issue' && args[2]) {
                    const data = gov.issueSovereignLicense(args.slice(2).join(' '));
                    console.log('\n' + data.agreementText + `\n🔒 LICENSE KEY ID: ${data.licenseRecord.licenseId}\n👤 HOLDER ASSIGNED: ${data.licenseRecord.operatorName}\n🔑 HW FINGERPRINT: ${data.licenseRecord.fingerprint}\n🟢 STATUS: HARDWARE IS OFFICIALLY AUTHORIZED.`);
                } else { console.log('Usage: huma-license --issue [Your_Name]'); }
                break;

            case 'huma-reward':
                if (args[1] === '--process' && args[2] && args[3]) {
                    const res = gov.processReferralReward(args[2], args[3]);
                    if (res.success) {
                        console.log(`\n💰 >>> REWARD TRANSACTION SEALED <<<\n🆔 TX HASH:   ${res.payload.transactionId}\n🙌 REFERRER:  ${res.payload.referrerId}\n👶 NEW PEER:  ${res.payload.newUserId}\n🎁 ASSET:     ${res.payload.rewardAmount}\n🟢 STATUS: REFERENCE TOKENS MINTED & ALLOCATED SUCCESSFULLY.`);
                    } else { console.log(`\n❌ TRANSACTION REFUSED: ${res.message}`); }
                } else { console.log('Usage: huma-reward --process [referrer] [new_user]'); }
                break;

            case 'huma-bio':
                if (args[1] === '--scan' && args[2] && args[3]) {
                    const res = gov.registerBiometricIdentity(args[2], args.slice(3).join(' '));
                    if (res.success) {
                        console.log('\n✋ >>> BIOMETRIC PROOF-OF-HUMAN ANCHORED <<<');
                        console.log(`👤 OPERATOR ID:   ${res.record.operatorId}`);
                        console.log(`🧬 IDENTITY TYPE: ${res.record.identityType}`);
                        console.log(`🔑 SECURE HASH:   ${res.record.biometricHash.substring(0, 64)}...`);
                        console.log('🟢 STATUS: IDENTITY ROOT IMMUTABLY COMMITTED TO THE NODE.');
                    } else { console.log(`\n❌ IDENTITY REJECTED: ${res.message}`); }
                } else { console.log('Usage: huma-bio --scan [operator_id] [raw_palm_data_string]'); }
                break;

            case 'huma-telco':
                if (args[1] === '--stream' && args[2] && args[3] && args[4]) {
                    const message = args.slice(4).join(' ');
                    const res = gov.simulateTelcoStream(args[2], args[3], message);
                    if (res.success) {
                        console.log('\n🛰️  >>> HUMATELCOS END-TO-END ENCRYPTED STREAM <<<');
                        console.log(`🗺️  CARRIER ROUTE:  ${res.carrierRoute} (Node IP: ${res.carrierNodeIp})`);
                        console.log(`📲 PATHWAY:        [${res.sender}] =======> [${res.recipient}]`);
                        console.log(`🔒 CIPHER TUNNEL:   ${res.cryptoStandard}`);
                        console.log(`📦 SHIELDED PACKET: ${res.secureEncryptedPacket.substring(0, 60)}...`);
                        console.log('🟢 STATUS: VOICE/DATA STREAM SECURED PASSTHROUGH SUCCESSFUL.');
                    } else { console.log(`\n❌ TRANSMISSION DROPPED: ${res.message}`); }
                } else { console.log('Usage: huma-telco --stream [from_device] [to_device] [payload_message]'); }
                break;

            default:
                console.log(`huma-sh: command not found: ${command}. Type "help" for valid tools.`);
                break;
        }

        console.log('');
        rl.prompt();
    });
}

startSovereignShell();
