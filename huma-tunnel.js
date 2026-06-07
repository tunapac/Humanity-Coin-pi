const WebSocket = require('ws');
const axios = require('axios');
const crypto = require('crypto');

// Sovereign Configuration Registry
const LOCAL_SERVER = 'http://localhost:3000';
// Public, decentralized bootstrap nodes running our P2P protocol
const SWARM_BOOTSTRAP_NODES = [
    'ws://bootstrap1.humanledger.net:8080',
    'ws://bootstrap2.humanledger.net:8080'
];

// Generate a permanent cryptographic identity for your tunnel node
const NODE_ID = "node_huma_" + crypto.randomBytes(16).toString('hex');

console.log(`===============================================`);
console.log(`🛡️ Sovereign P2P Tunnel Daemon Initializing...`);
console.log(`🆔 Node Identity: ${NODE_ID}`);
console.log(`===============================================`);

function connectToSwarm(nodeIndex = 0) {
    if (nodeIndex >= SWARM_BOOTSTRAP_NODES.length) {
        console.log("❌ Swarm: All bootstrap nodes offline. Retrying...");
        setTimeout(() => connectToSwarm(0), 5000);
        return;
    }

    const targetPeer = SWARM_BOOTSTRAP_NODES[nodeIndex];
    console.log(`📡 Swarm: Attempting P2P handshake with ${targetPeer}`);

    const ws = new WebSocket(targetPeer, {
        headers: { "x-huma-node-id": NODE_ID }
    });

    // Keep the mobile socket alive with active ping hearts
    let pingInterval;

    ws.on('open', () => {
        console.log(`✅ Sovereign P2P Tunnel Connected to Mesh Peer!`);
        
        // Heartbeat keeps Android OS from dropping the socket connection
        pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.ping();
            }
        }, 30000);
    });

    // Handle incoming globally-routed requests from the decentralized web
    ws.on('message', async (data) => {
        try {
            const incomingPacket = JSON.parse(data);
            const { requestId, method, url, body, headers } = incomingPacket;

            console.log(`📥 Tunnel Request: [${method}] ${url} -> Relay to Local`);

            // Forward the packet directly to your running server.js engine
            const localResponse = await axios({
                method: method,
                url: `${LOCAL_SERVER}${url}`,
                data: body,
                headers: { ...headers, 'x-forwarded-by': NODE_ID },
                validateStatus: () => true
            });

            // Package the local execution response back into a Web3 stream packet
            const responsePacket = {
                requestId,
                status: localResponse.status,
                headers: localResponse.headers,
                body: localResponse.data
            };

            // Stream it back to the global network requestor
            ws.send(JSON.stringify(responsePacket));
            console.log(`📤 Tunnel Response: Request ${requestId} handled cleanly.`);

        } catch (error) {
            console.log(`❌ Tunnel routing failure: ${error.message}`);
        }
    });

    ws.on('close', () => {
        console.log(`⚠️ Swarm Connection dropped. Cleaning up filters...`);
        clearInterval(pingInterval);
        // Failover: instantly attempt connection to alternative peer node
        setTimeout(() => connectToSwarm((nodeIndex + 1) % SWARM_BOOTSTRAP_NODES.length), 3000);
    });

    ws.on('error', (err) => {
        console.log(`❌ Socket Exception: ${err.message}`);
    });
}

// Boot the tunnel client daemon
connectToSwarm();
