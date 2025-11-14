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
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET!,
      secureCookie: process.env.NODE_ENV === "production",
    });

    if (!token || !token.sub) {
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

export const optionalNextAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET!,
      secureCookie: process.env.NODE_ENV === "production",
    });

    if (token && token.sub) {
      req.auth = {
        userId: token.sub,
        email: token.email as string | undefined,
      };
    }

    next();
  } catch (error) {
    console.error("Optional NextAuth middleware error:", error);
    next();
  }
};
