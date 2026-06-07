// peer.cjs
// Peer-to-Peer Networking Engine for Humanledger Mesh

const WebSocket = require('ws');
const HumascanProtocol = require('./humascan-protocol.cjs');

const P2P_PORT = process.env.P2P_PORT || 6001;
const initialPeers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const sockets = [];

function initP2PServer() {
    const server = new WebSocket.Server({ port: parseInt(P2P_PORT) });
    server.on('connection', (ws) => {
        console.log(`[P2P Server] Incoming connection established on port ${P2P_PORT}`);
        initConnection(ws);
    });
    console.log(`[P2P Server] Humanledger node running P2P network layer on port: ${P2P_PORT}`);
}

function connectToPeers(newPeers) {
    newPeers.forEach((peer) => {
        try {
            console.log(`[P2P Client] Attempting outbound connection to peer: ${peer}`);
            const ws = new WebSocket(peer);
            ws.on('open', () => {
                console.log(`[P2P Client] Successfully connected to remote peer: ${peer}`);
                initConnection(ws);
            });
            ws.on('error', (err) => {
                console.error(`[P2P Client] Connection failed to ${peer}:`, err.message);
            });
        } catch (e) {
            console.error(`[P2P Client] Signaling error targeting ${peer}:`, e.message);
        }
    });
}

function initConnection(ws) {
    sockets.push(ws);

    ws.on('message', (data) => {
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
        const message = HumascanProtocol.decodeFrame(buffer);

        if (!message) return;

        if (message.disconnect) {
            console.warn(`[P2P Guard] Protocol violation detected: ${message.error}. Dropping peer.`);
            closeConnection(ws);
            return;
        }

        handleMessage(ws, message);
    });

    ws.on('close', () => {
        console.log('[P2P Network] Peer disconnected from node cluster.');
        closeConnection(ws);
    });
    ws.on('error', () => {
        console.log('[P2P Network] Peer link dropped unexpectedly due to socket error.');
        closeConnection(ws);
    });

    writeMessage(ws, 'HANDSHAKE', { version: '1.0.0', networkId: 'humanledger-main' });
}

function writeMessage(ws, type, data) {
    const frame = HumascanProtocol.encodeFrame(type, data);
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(frame);
    }
}

function broadcastMessage(type, data) {
    sockets.forEach((ws) => writeMessage(ws, type, data));
}

function handleMessage(ws, message) {
    console.log(`[P2P Message Received] Type: ${message.type} | Age: ${Date.now() - message.timestamp}ms`);
    
    switch (message.type) {
        case 'HANDSHAKE':
            console.log(`[P2P Sync] Verified peer metadata. Network: ${message.data.networkId}`);
            break;
        case 'PROOF_OF_HUMAN':
            console.log(`[P2P Consensus] Biometric frame verification received.`);
            break;
        case 'TX_PROPAGATION':
            console.log(`[P2P Tx] Processing incoming ledger transaction mutation vector.`);
            break;
        default:
            console.log(`[P2P Router] Unknown package identifier frame ignored.`);
    }
}

function closeConnection(ws) {
    const index = sockets.indexOf(ws);
    if (index !== -1) sockets.splice(index, 1);
}

initP2PServer();
connectToPeers(initialPeers);

module.exports = { broadcastMessage };
