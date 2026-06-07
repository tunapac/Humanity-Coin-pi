const http = require('http');
const httpProxy = require('http-proxy');

// Create the universal proxy broker
const proxy = httpProxy.createProxyServer({});

// Core application routing matrix
const appPortMap = {
    'book.huma': 5001,
    'zup.huma':  5002,
    'tube.huma': 5003,
    'gram.huma': 5004
};

const server = http.createServer((req, res) => {
    let host = req.headers.host || '';

    try {
        // High-compatibility parsing for Cloudflare Quick Tunnels
        const urlObj = new URL(req.url, `http://${host}`);
        if (urlObj.searchParams.has('app')) {
            const appName = urlObj.searchParams.get('app').toLowerCase();
            host = `${appName}.huma`;
        }
    } catch (e) {
        // Fallback if URL parsing fails on raw network fragments
    }

    // Clean port extraction if host header includes structural ports (e.g., book.huma:8888)
    const cleanHost = host.split(':')[0].toLowerCase();

    // Check if the target exists in our sovereign registry
    if (appPortMap[cleanHost]) {
        const targetPort = appPortMap[cleanHost];
        console.log(`🔀 [H-Router] Routing ${cleanHost} ──► Internal Port ${targetPort}`);
        
        proxy.web(req, res, { target: `http://127.0.0.1:${targetPort}` }, (err) => {
            console.error(`⚠️ [H-Router] Proxy Connection Failed to port ${targetPort}:`, err.message);
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end('Sovereign App Service is currently offline or deploying.');
        });
    } else {
        // Fallback landing response if no valid application route matches
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <body style="font-family:sans-serif; background:#0f172a; color:#f8fafc; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0;">
                <div style="background:#1e293b; padding:2rem; border-radius:12px; border:1px solid #334155; text-align:center;">
                    <h2 style="color:#ef4444;">888+ H-Router: Route Not Found</h2>
                    <p>To access an application through this public edge corridor, use the app parameter:</p>
                    <code style="background:#020617; padding:0.5rem 1rem; border-radius:6px; color:#38bdf8; display:block; margin:1rem 0;">?app=book</code>
                    <small style="color:#64748b;">Humanledger Sovereign Architecture v2.0</small>
                </div>
            </body>
        `);
    }
});

// ==========================================
// GLOBAL PRODUCTION ERROR CATCHERS
// ==========================================
process.on('uncaughtException', (err) => {
    console.error('🔥 [H-Router] Critical Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 [H-Router] Unhandled Promise Rejection:', reason);
});

server.on('error', (err) => {
    console.error('⚠️ [H-Router] Server Socket Error:', err.message);
});

// // Start the core gateway engine on Global Web Port 80
server.listen(80, '0.0.0.0', () => {
    console.log('=========================================');
    console.log(' 🌐 888+ PRODUCTION H-ROUTER IS LIVE      ');
    console.log(' Listening on Standard Web Port: 80      ');
    console.log('=========================================');
});
