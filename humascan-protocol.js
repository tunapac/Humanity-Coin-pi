import http from 'http';
import fs from 'fs';
import crypto from 'crypto';

class HumascanProtocolEngine {
    constructor() {
        this.ledgerPath = './local-ledger.db';
        this.dnsPath = './huma-dns.json';
        this.bioPath = './biometrics-registry.db';
        this.rewardPath = './rewards-ledger.db';
        this.explorerPort = 5000;
        this.MAX_SUPPLY = 700000000;
    }

    // Helper to extract log history files cleanly
    readLogStream(filePath) {
        if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf8').trim() === '') return [];
        return fs.readFileSync(filePath, 'utf8').trim().split('\n').map(line => JSON.parse(line));
    }

    getMetrics() {
        const blocks = this.readLogStream(this.ledgerPath);
        const biometrics = this.readLogStream(this.bioPath);
        const rewards = this.readLogStream(this.rewardPath);
        
        let allocatedSupply = 0;
        blocks.forEach(b => { if (b.mintedAmount) allocatedSupply += parseFloat(b.mintedAmount); });

        return {
            totalBlocks: blocks.length,
            circulatingSupply: allocatedSupply,
            remainingSupply: this.MAX_SUPPLY - allocatedSupply,
            totalHumansVerified: biometrics.length,
            totalRewardsDistributed: rewards.length * 10
        };
    }

    // High-performance dynamic UI compilation script
    generateHTMLDashboard() {
        const metrics = this.getMetrics();
        const blocks = this.readLogStream(this.ledgerPath).reverse();
        const biometrics = this.readLogStream(this.bioPath).reverse();

        let blockRows = '';
        blocks.forEach(b => {
            blockRows += `
            <tr style="border-bottom: 1px solid #21262d;">
                <td style="padding:12px; color:#58a6ff;">#${b.blockHeight}</td>
                <td style="padding:12px; color:#3fb950; font-weight:bold;">+${b.mintedAmount?.toLocaleString()} HUMA</td>
                <td style="padding:12px; color:#8b949e;">${b.purpose}</td>
                <td style="padding:12px; color:#c9d1d9; font-size:11px; font-family:monospace;">${b.prevHash.substring(0,16)}...</td>
                <td style="padding:12px; color:#8b949e; font-size:12px;">${new Date(b.issuedAt || b.timestamp).toLocaleTimeString()}</td>
            </tr>`;
        });

        let bioRows = '';
        biometrics.forEach(m => {
            bioRows += `
            <tr style="border-bottom: 1px solid #21262d;">
                <td style="padding:12px; color:#ff7b72;">${m.operatorId}</td>
                <td style="padding:12px; color:#d2a8ff; font-size:11px; font-family:monospace;">${m.biometricHash.substring(0,32)}...</td>
                <td style="padding:12px; color:#8b949e; font-size:12px;">${new Date(m.verifiedAt).toLocaleTimeString()}</td>
            </tr>`;
        });

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>🛰️ HUMASCAN // Core Protocol Explorer</title>
            <meta http-equiv="refresh" content="5">
        </head>
        <body style="background:#0d1117; color:#c9d1d9; font-family:-apple-system,BlinkMacSystemFont,monospace; padding:30px; margin:0;">
            <div style="max-width:1200px; margin:0 auto;">
                
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #21262d; padding-bottom:20px; margin-bottom:30px;">
                    <div>
                        <h1 style="margin:0; color:#f0f6fc; letter-spacing:1px;">🛰️ HUMASCAN PROTOCOL</h1>
                        <p style="margin:5px 0 0 0; color:#8b949e; font-size:14px;">Independent Standalone Humanledger Engine Monitor • Live Network Feed</p>
                    </div>
                    <div style="text-align:right;">
                        <span style="background:#238636; color:#fff; padding:6px 12px; border-radius:20px; font-size:12px; font-weight:bold;">● CORE METRICS ACTIVE</span>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:40px;">
                    <div style="background:#161b22; padding:20px; border-radius:8px; border:1px solid #30363d;">
                        <div style="color:#8b949e; font-size:12px; font-weight:bold; text-transform:uppercase;">Circulating Supply</div>
                        <div style="font-size:24px; font-weight:bold; color:#3fb950; margin-top:10px;">${metrics.circulatingSupply.toLocaleString()} <span style="font-size:14px;">HUMA</span></div>
                    </div>
                    <div style="background:#161b22; padding:20px; border-radius:8px; border:1px solid #30363d;">
                        <div style="color:#8b949e; font-size:12px; font-weight:bold; text-transform:uppercase;">Protocol Cap</div>
                        <div style="font-size:24px; font-weight:bold; color:#f0f6fc; margin-top:10px;">700,000,000 <span style="font-size:14px;">MAX</span></div>
                    </div>
                    <div style="background:#161b22; padding:20px; border-radius:8px; border:1px solid #30363d;">
                        <div style="color:#8b949e; font-size:12px; font-weight:bold; text-transform:uppercase;">Committed Blocks</div>
                        <div style="font-size:24px; font-weight:bold; color:#58a6ff; margin-top:10px;"># ${metrics.totalBlocks}</div>
                    </div>
                    <div style="background:#161b22; padding:20px; border-radius:8px; border:1px solid #30363d;">
                        <div style="color:#8b949e; font-size:12px; font-weight:bold; text-transform:uppercase;">Biometric Human Roots</div>
                        <div style="font-size:24px; font-weight:bold; color:#d2a8ff; margin-top:10px;">${metrics.totalHumansVerified} Nodes</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:30px;">
                    
                    <div style="background:#161b22; padding:20px; border-radius:8px; border:1px solid #30363d;">
                        <h3 style="margin-top:0; border-bottom:1px solid #30363d; padding-bottom:10px; color:#f0f6fc;">📦 Live Transaction Blocks</h3>
                        <table style="width:100%; border-collapse:collapse; text-align:left;">
                            <thead>
                                <tr style="color:#8b949e; font-size:12px; border-bottom:2px solid #30363d;">
                                    <th style="padding:10px;">Height</th>
                                    <th style="padding:10px;">Allocation</th>
                                    <th style="padding:10px;">Purpose Mapping</th>
                                    <th style="padding:10px;">Parent Hash</th>
                                    <th style="padding:10px;">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${blockRows || '<tr><td colspan="5" style="padding:20px; text-align:center; color:#8b949e;">No blocks recorded in local-ledger.db yet.</td></tr>'}
                            </tbody>
                        </table>
                    </div>

                    <div style="background:#161b22; padding:20px; border-radius:8px; border:1px solid #30363d;">
                        <h3 style="margin-top:0; border-bottom:1px solid #30363d; padding-bottom:10px; color:#f0f6fc;">✋ Verified Human Registries</h3>
                        <table style="width:100%; border-collapse:collapse; text-align:left;">
                            <thead>
                                <tr style="color:#8b949e; font-size:12px; border-bottom:2px solid #30363d;">
                                    <th style="padding:10px;">Operator</th>
                                    <th style="padding:10px;">Palm Print Hash String</th>
                                    <th style="padding:10px;">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${bioRows || '<tr><td colspan="3" style="padding:20px; text-align:center; color:#8b949e;">No biometrics recorded.</td></tr>'}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </body>
        </html>`;
    }

    launchExplorerServer() {
        http.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(this.generateHTMLDashboard());
        }).listen(this.explorerPort, () => {
            console.log('\n========================================================');
            console.log('🛰️  HUMASCAN SMART INTERFACE PROTOCOL ENGINE IS LIVE');
            console.log(`📊 Open Explorer Interface on: http://52.87.213.65:${this.explorerPort}`);
            console.log('⚙️  Auto-Refresh Frequency: 5 Seconds Active');
            console.log('========================================================\n');
        });
    }
}

const engine = new HumascanProtocolEngine();
engine.launchExplorerServer();
