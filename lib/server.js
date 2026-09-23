const http = require("http");
const fs = require("fs");
const path = require("path");
const { createTask } = require("./models/task");
const { saveTask } = require("./store/taskStore");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const CONTENT_TYPES = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
};

function readRequestBody(req) {
    return new Promise((resolve, reject) => {
        let raw = "";
        req.on("data", (chunk) => {
            raw += chunk;
        });
        req.on("end", () => resolve(raw));
        req.on("error", reject);
    });
}

async function handleCreateTask(req, res) {
    let payload;
    try {
        const raw = await readRequestBody(req);
        payload = raw ? JSON.parse(raw) : {};
    } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON body" }));
        return;
    }

    let task;
    try {
        task = createTask(payload.title);
    } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
        return;
    }

    saveTask(task);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(task));
}

function serveStaticFile(req, res) {
    const requestPath = req.url === "/" ? "/index.html" : req.url;
    const filePath = path.join(PUBLIC_DIR, requestPath);

    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403);
        res.end();
        return;
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Not found");
            return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream" });
        res.end(content);
    });
}

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/api/tasks") {
        handleCreateTask(req, res);
        return;
    }

    if (req.method === "GET") {
        serveStaticFile(req, res);
        return;
    }

    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
});

module.exports = server;
