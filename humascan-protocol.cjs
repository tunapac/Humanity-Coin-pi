// humascan-protocol.cjs
// Custom network framing and message codec for Humanledger P2P Mesh

const MAGIC_BYTES = Buffer.from([0x48, 0x55, 0x4D, 0x41]); // "HUMA" ASCII identifying our network

class HumascanProtocol {
    static encodeFrame(type, data) {
        const payloadStr = JSON.stringify({ type, data, timestamp: Date.now() });
        const payloadBuffer = Buffer.from(payloadStr, 'utf-8');
        
        const lengthBuffer = Buffer.alloc(4);
        lengthBuffer.writeUInt32BE(payloadBuffer.length, 0);
        
        return Buffer.concat([MAGIC_BYTES, lengthBuffer, payloadBuffer]);
    }

    static decodeFrame(buffer) {
        if (buffer.length < 8) return null;
        
        const magic = buffer.subarray(0, 4);
        if (!magic.equals(MAGIC_BYTES)) {
            return { error: 'INVALID_NETWORK_MAGIC', disconnect: true };
        }
        
        const length = buffer.readUInt32BE(4);
        if (buffer.length < 8 + length) return null;
        
        try {
            const payloadStr = buffer.subarray(8, 8 + length).toString('utf-8');
            return JSON.parse(payloadStr);
        } catch (e) {
            return { error: 'MALFORMED_PAYLOAD_JSON', disconnect: true };
        }
    }
}

module.exports = HumascanProtocol;
