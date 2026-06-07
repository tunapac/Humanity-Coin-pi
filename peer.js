import { createLibp2p } from 'libp2p';
import { tcp } from '@libp2p/tcp';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@libp2p/yamux';
import { multiaddr } from '@multiformats/multiaddr';
import fs from 'fs';

// Load our standalone hardware configuration
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

async function startNode() {
    // If running on standalone hardware, listen globally on all interfaces (0.0.0.0)
    // If running on the temporary Android sandbox, bind to loopback (127.0.0.1)
    const listenAddress = config.environment.isStandaloneHardware 
        ? `/ip4/0.0.0.0/tcp/${config.environment.p2pPort}`
        : `/ip4/127.0.0.1/tcp/${config.environment.p2pPort}`;

    const node = await createLibp2p({
        addresses: {
            listen: [listenAddress]
        },
        transports: [tcp()],
        connectionEncryption: [noise()],
        streamMuxers: [yamux()]
    });

    await node.start();
    console.log('===================================================');
    console.log(`🌐 ${config.projectName.toUpperCase()} SOVEREIGN P2P NODE ONLINE`);
    console.log(`🆔 Unique Peer ID: ${node.peerId.toString()}`);
    console.log(`📊 Total Network Supply: ${config.totalSupply.toLocaleString()} Huma`);
    console.log(`🔒 Target Hardware Mode: ${config.environment.isStandaloneHardware ? 'DIRECT BARE-METAL' : 'SANDBOX SIMULATION'}`);
    console.log('===================================================');
    
    if (config.environment.isStandaloneHardware) {
        node.getMultiaddrs().forEach(addr => {
            console.log(`📍 Hardware Network Address: ${addr.toString()}`);
        });
    } else {
        const localAddr = multiaddr(`${listenAddress}/p2p/${node.peerId.toString()}`);
        console.log(`📍 Sandboxed Local Address: ${localAddr.toString()}`);
    }
}

startNode().catch(err => {
    console.error('❌ Engine failed to initialize:', err);
});

