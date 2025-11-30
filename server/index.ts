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
  
  // Routes that should be handled directly by Next.js (before any Express middleware)
  // Note: /api/auth is handled specially - only NextAuth routes go to Next.js, not /api/auth/user
  const shouldRouteToNextJs = (url: string | undefined) => {
    if (!url) return false;
    
    // Static files always go to Next.js
    if (url.startsWith('/_next')) return true;
    
    // NextAuth routes (but NOT /api/auth/user which is an Express route)
    if (url.startsWith('/api/auth/') && !url.startsWith('/api/auth/user')) return true;
    
    // Next.js API routes
    if (url.startsWith('/api/onboarding')) return true;
    if (url.startsWith('/api/user')) return true;
    if (url.startsWith('/api/analytics')) return true;
    if (url.startsWith('/api/preferences')) return true;
    
    return false;
  };
  
  // Middleware to route Next.js paths directly to Next.js handler
  server.use((req, res, next) => {
    if (shouldRouteToNextJs(req.url)) {
      return handle(req, res);
    }
    next();
  });
  
  // Parse JSON for Express API routes
  server.use('/api', express.json());
  server.use('/api', express.urlencoded({ extended: true }));

  const httpServer = await registerRoutes(server);

  // Catch-all for everything else (pages, other static files)
  server.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
