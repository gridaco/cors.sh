// A controlled test-page origin (foreign to the mock + proxy) so the browser
// performs a real cross-origin fetch and enforces CORS.
import http from "node:http";

const PORT = Number(process.env.PAGE_PORT || 8090);
http
  .createServer((_req, res) => {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(
      "<!doctype html><html><head><title>e2e</title></head><body>cors.sh e2e origin</body></html>",
    );
  })
  .listen(PORT, () => console.log(`page origin on http://localhost:${PORT}`));
