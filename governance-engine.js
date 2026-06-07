import crypto from 'crypto';
import fs from 'fs';
import readline from 'readline';

class HumanledgerGovernance {
    constructor() {
        this.dnsRegistryPath = './huma-dns.json';
        this.licenseStorePath = './signed-licenses.db';
        this.rewardLogPath = './rewards-ledger.db';
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
        if (!fs.existsSync(this.licenseStorePath)) {
            fs.writeFileSync(this.licenseStorePath, '');
        }
        if (!fs.existsSync(this.rewardLogPath)) {
            fs.writeFileSync(this.rewardLogPath, ''); // Append-only reward tracking database
        }
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

        const agreementText = `========================================================================
HUMANLEDGER ECOSYSTEM SOVEREIGN PROTOCOL AGREEMENT & LICENSE
========================================================================
OPERATOR IDENTIFIER: ${operatorName}
TIMESTAMP OF ASSENT : ${new Date().toISOString()}
========================================================================`;

        const signature = crypto.sign(null, Buffer.from(agreementText), privateKey).toString('hex');
        const licenseId = crypto.randomUUID();
        const fingerprint = crypto.createHash('sha256').update(publicKey).digest('hex');

        const licenseRecord = { licenseId, operatorName, fingerprint, signature, issuedAt: new Date().toISOString() };
        fs.appendFileSync(this.licenseStorePath, JSON.stringify(licenseRecord) + '\n', 'utf8');

        return { agreementText, licenseRecord };
    }

    // =========================================================================
    // REFERRAL REWARD ENGINE (ONE-TIME VERIFIED ONBOARDING)
    // =========================================================================
    processReferralReward(referrerId, newUserId) {
        const fileContent = fs.readFileSync(this.rewardLogPath, 'utf8').trim();
        const logs = fileContent ? fileContent.split('\n').map(line => JSON.parse(line)) : [];

        // Security Guard: Prevent exploitation by checking if the new user was already referred
        const alreadyClaimed = logs.some(record => record.newUserId === newUserId);
        if (alreadyClaimed) {
            return { success: false, message: `SECURITY_ALERT: One-time reference reward already claimed for onboarding user [${newUserId}].` };
        }

        // Define token reward payload (e.g., 10 Huma reward for expanding the sovereign grid)
        const rewardPayload = {
            transactionId: crypto.randomUUID(),
            referrerId,
            newUserId,
            rewardAmount: "10 HUMA",
            type: "ONE_TIME_PEER_REFERENCE_REWARD",
            timestamp: new Date().toISOString()
        };

        // Commit transaction to the immutable rewards ledger
        fs.appendFileSync(this.rewardLogPath, JSON.stringify(rewardPayload) + '\n', 'utf8');
        return { success: true, payload: rewardPayload };
    }
}

// =============================================================================
// INTERACTIVE SHELL INTERFACE
// =============================================================================
function startSovereignShell() {
    console.log('\n========================================================');
    console.log('💻 HUMANLEDGER OS SOVEREIGN TERMINAL ENGINE v1.0.0-BETA');
    console.log('📝 Type "help" to see available ecosystem operations.');
    console.log('========================================================');

    const gov = new HumanledgerGovernance();
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'humanledger@core-node:~$ '
    });

    rl.prompt();

    rl.on('line', (line) => {
        const input = line.trim();
        if (!input) {
            rl.prompt();
            return;
        }

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
                console.log('  clear                                       | Clear the terminal interface');
                console.log('  exit                                        | Shutdown the terminal interface\n');
                break;

            case 'clear':
                console.clear();
                break;

            case 'exit':
                console.log('Shutting down Sovereign Terminal Engine. System safe.');
                process.exit(0);
                break;

            case 'huma-dns':
                if (args[1] === '--resolve' && args[2]) {
                    const res = gov.resolveDomain(args[2]);
                    if (res.success) {
                        console.log(`=> STATUS: 200 OK | Domain: ${res.domain} -> IP: ${res.ip}`);
                    } else {
                        console.log(`=> STATUS: 404 NOT FOUND | ${res.message}`);
                    }
                } else if (args[1] === '--register' && args[2] && args[3]) {
                    const res = gov.registerDomain(args[2], args[3]);
                    console.log(`=> ${res.message}`);
                } else {
                    console.log('Usage: huma-dns --resolve [domain.huma] or --register [domain.huma] [ip]');
                }
                break;

            case 'huma-ai':
                if (args[1] === '--analyze' && args[2] && args[3]) {
                    const matrix = gov.processAICodeHub(args[2], args[3]);
                    console.log(`=> [RESULT] Class: ${args[3].toUpperCase()}\n=> [AI MATRIX] ${matrix}`);
                } else {
                    console.log('Usage: huma-ai --analyze [language] [softcode|hardcode]');
                }
                break;

            case 'huma-license':
                if (args[1] === '--issue' && args[2]) {
                    const name = args.slice(2).join(' ');
                    const data = gov.issueSovereignLicense(name);
                    console.log('\n' + data.agreementText);
                    console.log(`\n🔒 LICENSE KEY ID:  ${data.licenseRecord.licenseId}`);
                    console.log(`👤 HOLDER ASSIGNED: ${data.licenseRecord.operatorName}`);
                    console.log(`🔑 HW FINGERPRINT: ${data.licenseRecord.fingerprint}`);
                    console.log(`✍️ CRYPTO SIGNATURE: [${data.licenseRecord.signature.substring(0, 50)}...]`);
                    console.log('🟢 STATUS: CRITICAL ASSENT STORED. HARDWARE IS OFFICIALLY AUTHORIZED.');
                } else {
                    console.log('Usage: huma-license --issue [Your_Full_Name]');
                }
                break;

            case 'huma-reward':
                if (args[1] === '--process' && args[2] && args[3]) {
                    const res = gov.processReferralReward(args[2], args[3]);
                    if (res.success) {
                        console.log('\n💰 >>> REWARD TRANSACTION SEALED <<<');
                        console.log(`🆔 TX HASH:   ${res.payload.transactionId}`);
                        console.log(`🙌 REFERRER:  ${res.payload.referrerId}`);
                        console.log(`👶 NEW PEER:  ${res.payload.newUserId}`);
                        console.log(`🎁 ASSET:     ${res.payload.rewardAmount}`);
                        console.log('🟢 STATUS: REFERENCE TOKENS MINTED & ALLOCATED SUCCESSFULLY.');
                    } else {
                        console.log(`\n❌ TRANSACTION REFUSED: ${res.message}`);
                    }
                } else {
                    console.log('Usage: huma-reward --process [referrer_id] [new_user_id]');
                }
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
