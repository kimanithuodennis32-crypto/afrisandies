import serverless from "serverless-http";
import { app } from "../../backend/src/app";

// Runs the Express API as a Netlify serverless function.
// basePath strips the function prefix so Express sees /api/... and /health.
export const handler = serverless(app, { basePath: "/.netlify/functions/api" });
