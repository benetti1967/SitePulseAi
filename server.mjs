import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number.parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "127.0.0.1";

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".json": "application/manifest+json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

createServer((request, response) => {
  const requestUrl = new URL(request.url || "/", `http://${request.headers.host}`);
  if (requestUrl.pathname === "/app.html") {
    response.writeHead(302, { location: `/${requestUrl.search}${requestUrl.hash}` });
    response.end();
    return;
  }
  const cleanPath = normalize(decodeURIComponent(requestUrl.pathname))
    .replace(/^[/\\]+/, "")
    .replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(join(root, cleanPath === "" ? "index.html" : cleanPath));

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, { "content-type": types[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}).listen(port, host, () => {
  console.log(`SitePulseAi running at http://${host}:${port}`);
});


