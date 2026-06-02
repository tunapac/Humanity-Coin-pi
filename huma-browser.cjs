const readline = require('readline');
const axios = require('axios');
const fs = require('fs');

const CORE_ENGINE = 'http://localhost:3000';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log(`===============================================`);
console.log(`🌐 HUMABROWSER: Sovereign Web3 Terminal Client`);
console.log(`   Connected Engine: ${CORE_ENGINE}`);
console.log(`===============================================`);

function launchBrowserPrompt() {
    rl.question('HumaBrowser:// ', async (input) => {
        let domain = input.trim().toLowerCase();
        
        if (domain === 'exit') {
            rl.close();
            return;
        }

        if (!domain) {
            launchBrowserPrompt();
            return;
        }

        try {
            console.log(`🔍 Resolving ${domain} via P2P DNS...`);
            
            // Query local core engine for Web3 TLD records
            const dnsRes = await axios.get(
                `${CORE_ENGINE}/api/dns/resolve/${domain}`
            );
            
            const targetAddress = dnsRes.data.address;
            console.log(`✅ Resolved! Target Address: ${targetAddress}`);
            console.log(`📥 Fetching decentralized payload...`);
            
            // Read the decentralized asset directly from local storage
            if (fs.existsSync('./index.html')) {
                const payloadHtml = fs.readFileSync('./index.html', 'utf8');
                console.log(`\n--- [ RENDERED CONTENT: ${domain} ] ---`);
                console.log(payloadHtml);
                console.log(`-----------------------------------------\n`);
            } else {
                console.log(`⚠️ Payload Alert: DNS resolved, but index.html file is missing on local storage.`);
            }
            
        } catch (err) {
            console.log(`❌ Operational Error:`);
            if (err.response) {
                console.log(`   Engine Error Status: ${err.response.status}`);
            } else {
                console.log(`   Network Connection Failed: ${err.message}`);
            }
        }
        launchBrowserPrompt();
    });
}

launchBrowserPrompt();
