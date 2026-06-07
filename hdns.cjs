const dgram = require('dgram');
const fs = require('fs');
const path = require('path');

const server = dgram.createSocket('udp4');
const ZONE_FILE = path.join(__dirname, 'huma_zones.json');

// Helper to safely fetch local network records
function loadZones() {
    try {
        if (fs.existsSync(ZONE_FILE)) {
            return JSON.parse(fs.readFileSync(ZONE_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('⚠️ [Huma-DNS] Failed reading zone file:', e.message);
    }
    return {};
}

server.on('message', (msg, rinfo) => {
    try {
        if (msg.length < 12) return; // Drop invalid data bursts safely

        // Extract the raw hostname out of the DNS binary stream payload
        let position = 12;
        let parts = [];
        while (position < msg.length) {
            let len = msg[position];
            if (len === 0) break;
            parts.push(msg.slice(position + 1, position + 1 + len).toString('binary'));
            position += 1 + len;
        }
        
        const domain = parts.join('.');
        if (!domain) return;

        const zones = loadZones();
        console.log(`🔍 [Huma-DNS] Incoming Request: ${domain}`);

        if (zones[domain]) {
            const targetIp = zones[domain];
            
            // Build the standard binary DNS Loopback Response Packet
            const response = Buffer.alloc(msg.length + 16);
            msg.copy(response, 0, 0, msg.length);
            
            // Toggle Response Flags inside raw bytes
            response.writeUInt16BE(0x8180, 2); // Standard query response, no error
            response.writeUInt16BE(1, 6);      // Answer count: 1

            let offset = msg.length;
            response.writeUInt16BE(0xc00c, offset); // Name offset pointer
            response.writeUInt16BE(1, offset + 2);  // Type: A record
            response.writeUInt16BE(1, offset + 4);  // Class: IN
            response.writeUInt32BE(300, offset + 6); // TTL: 5 minutes
            response.writeUInt16BE(4, offset + 10); // IP Length: 4 bytes

            // Inject IP Address bytes directly into the buffer stream
            const ipBytes = targetIp.split('.').map(Number);
            for (let i = 0; i < 4; i++) {
                response[offset + 12 + i] = ipBytes[i];
            }

            server.send(response, 0, response.length, rinfo.port, rinfo.address);
            console.log(`✅ [Huma-DNS] Resolved: ${domain} ──► ${targetIp}`);
        }
    } catch (err) {
        console.error('🔥 [Huma-DNS] Internal parser error:', err.message);
    }
});

// ==========================================
// GLOBAL PRODUCTION ERROR CATCHERS
// ==========================================
process.on('uncaughtException', (err) => {
    console.error('🔥 [Huma-DNS] Critical Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 [Huma-DNS] Unhandled Promise Rejection:', reason);
});

server.on('error', (err) => {
    console.error('⚠️ [Huma-DNS] Socket interface failure:', err.message);
});

// Start the Authoritative DNS Engine on Global Port 53
server.bind(53, '0.0.0.0', () => {
    console.log('=========================================');
    console.log('� GLOBAL AUTHORITATIVE HUMAN-DNS LIVE  ');
    console.log(' Listening on Standard UDP Port: 53      ');
    console.log('=========================================');
});
