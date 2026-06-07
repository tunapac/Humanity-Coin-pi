import http from 'http';
import fs from 'fs';
import crypto from 'crypto';

class Web3DNSEngine {
    constructor() {
        this.dnsRegistryPath = './huma-dns.json';
        this.rpcPort = 9000; // Standard Web3 RPC port layout
    }

    getRegistry() {
        if (!fs.existsSync(this.dnsRegistryPath)) {
            return {};
        }
        return JSON.parse(fs.readFileSync(this.dnsRegistryPath, 'utf8'));
    }

    startWeb3Portal() {
        http.createServer((req, res) => {
            // Set Web3 CORS headers so any decentralized app (dApp) can fetch data
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.setHeader('Content-Type', 'application/json');

            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }

            // Web3 RPC JSON Interface handling
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => { body += chunk.toString(); });
                req.on('end', () => {
                    try {
                        const rpcRequest = JSON.parse(body);
                        const { method, params, id } = rpcRequest;

                        console.log(`[🔮 Web3 RPC Call] Method: ${method} | Request ID: ${id}`);

                        const registry = this.getRegistry();

                        // Web3 Method Resolution
                        if (method === 'huma_resolveDomain') {
                            const domain = params[0];
                            const targetIp = registry[domain];

                            if (targetIp) {
                                res.writeHead(200);
                                res.end(JSON.stringify({
                                    jsonrpc: "2.0",
                                    id: id,
                                    result: {
                                        status: "RESOLVED",
                                        domain: domain,
                                        ip: targetIp,
                                        authority: "Humanledger_Alternative_Root",
                                        blockAnchored: true
                                    }
                                }));
                            } else {
                                res.writeHead(200);
                                res.end(JSON.stringify({
                                    jsonrpc: "2.0",
                                    id: id,
                                    error: { code: -32602, message: `NXDOMAIN: ${domain} not found in Web3 registry.` }
                                }));
                            }
                        } else if (method === 'huma_getAllRecords') {
                            res.writeHead(200);
                            res.end(JSON.stringify({ jsonrpc: "2.0", id: id, result: registry }));
                        } else {
                            res.writeHead(404);
                            res.end(JSON.stringify({ jsonrpc: "2.0", id: id, error: { code: -32601, message: "Method not found" } }));
                        }

                    } catch (err) {
                        res.writeHead(400);
                        res.end(JSON.stringify({ error: "INVALID_JSON_RPC_PAYLOAD" }));
                    }
                });
            } else {
                // Quick browser diagnostic view
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                    <body style="font-family:monospace; background:#0d1117; color:#58a6ff; padding:40px;">
                        <h2>🔮 HUMANLEDGER WEB3.0 ROOT DNS PORTAL</h2>
                        <hr color="#21262d">
                        <p>Status: ACTIVE | Broadcast Ingress: Operational</p>
                        <p>This node is acting as a decentralized Web3 Alternative Root Server on Port ${this.rpcPort}.</p>
                    </body>
                `);
            }
        }).listen(this.rpcPort, () => {
            console.log('\n========================================================');
            console.log('🔮 HUMANLEDGER WEB3.0 ALTERNATIVE ROOT ENGINE');
            console.log(`📡 Open RPC Gateway Broadcasting live on Port: ${this.rpcPort}`);
            console.log('========================================================\n');
        });
    }
}

const web3DNS = new Web3DNSEngine();
web3DNS.startWeb3Portal();
