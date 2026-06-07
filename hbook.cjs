const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Huma Book</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .card { background: #1e293b; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.7); text-align: center; border: 1px solid #334155; max-width: 400px; }
                h1 { color: #38bdf8; margin: 0 0 0.5rem 0; font-size: 2rem; }
                p { color: #cbd5e1; font-size: 1rem; line-height: 1.5; margin-bottom: 1.5rem; }
                .status { background: #15803d; color: #bbf7d0; padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .pulse { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block; animation: blink 1.5s infinite; }
                @keyframes blink { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
                small { color: #64748b; font-size: 0.75rem; border-top: 1px solid #334155; display: block; padding-top: 1rem; width: 100%; }
            </style>
        </head>
        <body>
            <div class="card">
                <span class="status"><span class="pulse"></span>Sovereign Network Active</span>
                <h1>📖 Huma Book</h1>
                <p>Welcome to the Humanledger Project decentralized core profile registry and human validation layer.</p>
                <small>Served globally via Universal H-Router Reverse-Proxy</small>
            </div>
        </body>
        </html>
    `);
});

process.on('uncaughtException', (err) => console.error('🔥 [Huma-Book] Uncaught Exception:', err.message));

server.listen(5001, () => {
    console.log('=========================================');
    console.log('    HUMA BOOK CORE PLATFORM ONLINE       ');
    console.log('    Running Internally on Port: 5001     ');
    console.log('=========================================');
});
