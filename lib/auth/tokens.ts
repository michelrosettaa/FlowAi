import { db } from "../db/client";
import { authAccounts } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { google } from "googleapis";

export type OAuthProvider = "google" | "microsoft-entra-id";

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: number | null;
  scope: string | null;
}

export async function getOAuthAccount(userId: string, provider: OAuthProvider) {
  const [account] = await db
    .select()
    .from(authAccounts)
    .where(
      and(
        eq(authAccounts.userId, userId),
        eq(authAccounts.provider, provider)
      )
    )
    .limit(1);

  return account;
}

export async function refreshGoogleToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresAt: number;
}> {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();

  return {
    accessToken: credentials.access_token!,
    expiresAt: credentials.expiry_date! / 1000,
  };
}

export async function refreshMicrosoftToken(refreshToken: string): Promise<{
  accessToken: string;
  expiresAt: number;
}> {
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to refresh Microsoft token");
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
  };
}

export async function getUserTokens(
  userId: string,
  provider: OAuthProvider
): Promise<OAuthTokens> {
  let account = await getOAuthAccount(userId, provider);

  if (!account) {
    throw new Error(`${provider} account not connected`);
  }

  const now = Math.floor(Date.now() / 1000);
  const needsRefresh = account.expires_at && account.expires_at < now + 60;

  if (needsRefresh && account.refresh_token) {
    const refreshed =
      provider === "google"
        ? await refreshGoogleToken(account.refresh_token)
        : await refreshMicrosoftToken(account.refresh_token);

    await db
      .update(authAccounts)
      .set({
        access_token: refreshed.accessToken,
        expires_at: refreshed.expiresAt,
      })
      .where(
        and(
          eq(authAccounts.userId, userId),
          eq(authAccounts.provider, provider)
        )
      );

    account.access_token = refreshed.accessToken;
    account.expires_at = refreshed.expiresAt;
  }

  return {
    accessToken: account.access_token!,
    refreshToken: account.refresh_token,
    expiresAt: account.expires_at,
    scope: account.scope,
  };
}
