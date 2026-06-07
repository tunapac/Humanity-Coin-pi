import https from 'https';
import http from 'http';
import fs from 'fs';

class HumanledgerSecureGateway {
    constructor() {
        this.dnsRegistryPath = './huma-dns.json';
        this.publicPortHTTPS = 443; // Secure Web Port
        this.publicPortHTTP = 80;   // Standard Web Port for Redirects
    }

    getInternalRoute(hostname) {
        if (!fs.existsSync(this.dnsRegistryPath)) return null;
        const registry = JSON.parse(fs.readFileSync(this.dnsRegistryPath, 'utf8'));
        return registry[hostname] || null;
    }

    startGateway() {
        // SSL options looking for your private key and certificate files
        // Note: For testing, these can be self-signed keys generated via OpenSSL
        const sslOptions = {
            key: fs.existsSync('./private-key.pem') ? fs.readFileSync('./private-key.pem') : null,
            cert: fs.existsSync('./certificate.pem') ? fs.readFileSync('./certificate.pem') : null
        };

        if (!sslOptions.key || !sslOptions.cert) {
            console.log('\n🔒 [GENESIS CONFIGURATION]: No SSL certificates found yet.');
            console.log('👉 Running in HTTP-Ready mode on Port 80 until keys are generated.');
            this.startStandardServer();
            return;
        }

        // Create Secure HTTPS Server
        https.createServer(sslOptions, (req, res) => {
            const urlObj = new URL(req.url, `https://${req.headers.host}`);
            const targetDomain = urlObj.searchParams.get('domain');

            if (targetDomain) {
                const targetIp = this.getInternalRoute(targetDomain);
                if (targetIp) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: "SECURE_CONNECTION", sovereignDomain: targetDomain, internalIp: targetIp }));
                    return;
                }
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h3>🛰️ HUMANLEDGER OS SECURE HTTPS GATEWAY ACTIVE</h3>');
        }).listen(this.publicPortHTTPS, () => {
            console.log(`\n🟢 SECURE GATEWAY ACTIVE: Listening on Encrypted Port ${this.publicPortHTTPS}`);
        });
    }

    startStandardServer() {
        http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h3>🛰️ HUMANLEDGER ECOSYSTEM PUBLIC GATEWAY (HTTP MODE)</h3>');
        }).listen(this.publicPortHTTP);
    }
}

const gateway = new HumanledgerSecureGateway();
gateway.startGateway();
