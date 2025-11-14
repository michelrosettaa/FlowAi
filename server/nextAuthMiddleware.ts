import { type RequestHandler } from "express";
import { getToken } from "next-auth/jwt";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        email?: string;
      };
    }
  }
}

export const requireNextAuth: RequestHandler = async (req, res, next) => {
  try {
    console.log("Auth middleware called for:", req.url);
    console.log("Cookies:", req.headers.cookie ? "Present" : "Missing");
    
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    console.log("Token found:", token ? "Yes" : "No", token?.sub || "no sub");

    if (!token || !token.sub) {
      console.log("Unauthorized: No token or sub");
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.auth = {
      userId: token.sub,
      email: token.email as string | undefined,
    };

    next();
  } catch (error) {
    console.error("NextAuth middleware error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
