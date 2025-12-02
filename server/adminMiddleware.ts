import { RequestHandler } from "express";
import { getToken } from "next-auth/jwt";
import { db } from "./db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";

export const requireAdmin: RequestHandler = async (req, res, next) => {
  try {
    const token = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET!,
      secureCookie: process.env.NODE_ENV === "production",
    });

    if (!token || !token.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [user] = await db
      .select({ isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.id, token.sub));

    if (!user?.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    (req as any).auth = {
      userId: token.sub,
      email: token.email as string | undefined,
      isAdmin: true,
    };

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
