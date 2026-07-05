const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const port = Number(process.env.PORT || 5177);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".png": "image/png",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === "/") {
    res.writeHead(302, {
      Location: "/visualizer/",
      "Cache-Control": "no-store",
    });
    res.end();
    return;
  }

  const relativePath = pathname.replace(/^\/+/, "");
  const filePath = path.resolve(rootDir, relativePath);

  if (!filePath.startsWith(rootDir)) {
    send(res, 403, "text/plain; charset=utf-8", "Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    if (statError) {
      send(res, 404, "text/plain; charset=utf-8", "Not found");
      return;
    }

    const target = stat.isDirectory() ? path.join(filePath, "index.html") : filePath;
    const ext = path.extname(target).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    fs.readFile(target, (readError, content) => {
      if (readError) {
        send(res, 500, "text/plain; charset=utf-8", "Internal server error");
        return;
      }

      send(res, 200, contentType, content);
    });
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Infra integration map is running at http://127.0.0.1:${port}/`);
  console.log("Press Ctrl+C to stop.");
});

function send(res, statusCode, contentType, body) {
  res.writeHead(statusCode, {
    "Content-Type": contentType,
    "Cache-Control": "no-store",
  });
  res.end(body);
}
