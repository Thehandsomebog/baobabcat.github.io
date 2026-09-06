// Production-like static serving of the exact deployment artifact, including nested 404s.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = process.argv[3] ? path.resolve(process.argv[3]) : path.resolve(__dirname, "../_site");
const port = Number(process.argv[2] || 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".xml": "application/xml", ".txt": "text/plain" };

http.createServer((request, response) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname); }
    catch { response.writeHead(400).end(); return; }
    const target = path.resolve(root, `.${pathname}`);
    if (!target.startsWith(`${root}${path.sep}`) && target !== root || pathname.includes("\0")) {
        response.writeHead(400).end(); return;
    }
    if (!["GET", "HEAD"].includes(request.method)) { response.writeHead(405).end(); return; }
    let file = target;
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        if (!pathname.endsWith("/")) { response.writeHead(301, { Location: `${pathname}/${new URL(request.url, "http://localhost").search}` }).end(); return; }
        file = path.join(file, "index.html");
    }
    const found = fs.existsSync(file) && fs.statSync(file).isFile();
    if (!found) file = path.join(root, "404.html");
    response.writeHead(found ? 200 : 404, { "Content-Type": types[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    if (request.method === "HEAD") response.end();
    else fs.createReadStream(file).on("error", () => response.destroy()).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Artifact preview: http://127.0.0.1:${port}`));
