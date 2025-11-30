import "dotenv/config";
import express from "express";
import next from "next";
import { registerRoutes } from "./routes";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = parseInt(process.env.PORT || "5000", 10);

// Set NEXTAUTH_URL if not already set
if (!process.env.NEXTAUTH_URL) {
  const replitDomain = process.env.REPLIT_DOMAINS;
  if (replitDomain) {
    process.env.NEXTAUTH_URL = `https://${replitDomain}`;
    process.env.NEXTAUTH_URL_INTERNAL = `http://0.0.0.0:5000`;
    console.log(`✅ Set NEXTAUTH_URL to: ${process.env.NEXTAUTH_URL}`);
  }
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();
  
  // NOTE: Removed express-session middleware - NextAuth uses JWT sessions
  // and express-session was interfering with NextAuth cookie handling
  
  // Don't parse body for Next.js API routes - let Next.js handle them
  server.use((req, res, next) => {
    if (req.url?.startsWith('/api/auth') || req.url?.startsWith('/api/onboarding') || req.url?.startsWith('/api/user')) {
      return next();
    }
    express.json()(req, res, next);
  });
  
  server.use((req, res, next) => {
    if (req.url?.startsWith('/api/auth') || req.url?.startsWith('/api/onboarding') || req.url?.startsWith('/api/user')) {
      return next();
    }
    express.urlencoded({ extended: true })(req, res, next);
  });

  const httpServer = await registerRoutes(server);

  server.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
