import express from "express";
import session from "express-session";
import next from "next";
import { registerRoutes } from "./routes";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = parseInt(process.env.PORT || "5000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();
  
  // Express session middleware for unauthenticated users
  server.use(
    session({
      secret: process.env.NEXTAUTH_SECRET || "flowai-dev-secret-change-in-production",
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
      },
    })
  );
  
  // Don't parse body for NextAuth routes - let Next.js handle them
  server.use((req, res, next) => {
    if (req.url?.startsWith('/api/auth')) {
      return next();
    }
    express.json()(req, res, next);
  });
  
  server.use((req, res, next) => {
    if (req.url?.startsWith('/api/auth')) {
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
