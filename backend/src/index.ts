import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { app } from "./app";

// ---- Serve the built storefront (frontend/dist) from this same server ----
// One service, one URL, no CORS needed in production.
const distCandidates = [
  process.env.FRONTEND_DIST,
  path.resolve(__dirname, "../../frontend/dist"), // tsx: backend/src -> frontend/dist
  path.resolve(__dirname, "../../../frontend/dist"), // built: backend/dist/src -> frontend/dist
].filter((d): d is string => Boolean(d));
const frontendDist = distCandidates.find((d) => fs.existsSync(path.join(d, "index.html")));

if (frontendDist) {
  // Hashed build assets can be cached for a long time; index.html must not be.
  app.use(
    "/assets",
    express.static(path.join(frontendDist, "assets"), { maxAge: "1y", immutable: true })
  );
  app.use(express.static(frontendDist, { maxAge: "1h", index: false }));
  // The storefront uses hash routing (#/shop etc.), so index.html is the only page.
  app.get("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(frontendDist, "index.html"));
  });
  console.log(`Serving storefront from ${frontendDist}`);
} else {
  console.log("No frontend build found (run `npm run build` at the project root). API only.");
}

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`AFRI SANDIES API listening on http://localhost:${port}`);
});
