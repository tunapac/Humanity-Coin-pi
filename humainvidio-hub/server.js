const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve your index.html asset directly to the Pi Browser
app.use(express.static(path.join(__dirname, 'public')));

// 💎 Pi Payment Approval endpoint
app.post('/api/pi-approve', (req, res) => {
    const { paymentId } = req.body;
    console.log(`[Pi Network] Payment ID ${paymentId} received. Requesting blockchain authorization approval...`);
    // Here you will integrate the Pi Server-to-Server REST API later
    res.json({ approved: true });
});

// 💎 Pi Payment Completion endpoint
app.post('/api/pi-complete', (req, res) => {
    const { paymentId, txid } = req.body;
    console.log(`[Pi Network] Payment Complete! TxID: ${txid} for Payment ID: ${paymentId}`);
    res.json({ success: true });
});

// 🎬 Multi-Modal Generation Endpoint Simulation
app.post('/api/generate-scene', (req, res) => {
    console.log(`[AI Engine] Initializing compilation for: "${req.body.title}"`);
    // Emulating processing time, then returns a dummy fileId string asset reference
    setTimeout(() => {
        res.json({ fileId: "generated_cinematic_frame_sample.mp4" });
    }, 2000);
});

app.listen(PORT, () => {
    console.log(`🚀 HUMAINVIDIO AI Hub successfully running on port ${PORT}`);
});
