export interface EmailProviderConfig {
  name: string;
  provider: "gmail" | "outlook" | "yahoo" | "icloud" | "protonmail" | "custom";
  imap: {
    host: string;
    port: number;
    secure: boolean;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
  };
  setupInstructions?: string;
}

export const EMAIL_PROVIDERS: Record<string, EmailProviderConfig> = {
  gmail: {
    name: "Gmail",
    provider: "gmail",
    imap: {
      host: "imap.gmail.com",
      port: 993,
      secure: true,
    },
    smtp: {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
    },
    setupInstructions: "Use an App Password from your Google Account settings (not your regular Gmail password).",
  },
  outlook: {
    name: "Outlook / Office 365",
    provider: "outlook",
    imap: {
      host: "outlook.office365.com",
      port: 993,
      secure: true,
    },
    smtp: {
      host: "smtp.office365.com",
      port: 587,
      secure: true,
    },
    setupInstructions: "Use your Microsoft account password or an app-specific password.",
  },
  yahoo: {
    name: "Yahoo Mail",
    provider: "yahoo",
    imap: {
      host: "imap.mail.yahoo.com",
      port: 993,
      secure: true,
    },
    smtp: {
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
    },
    setupInstructions: "Generate an app password from your Yahoo Account Security settings.",
  },
  icloud: {
    name: "iCloud Mail",
    provider: "icloud",
    imap: {
      host: "imap.mail.me.com",
      port: 993,
      secure: true,
    },
    smtp: {
      host: "smtp.mail.me.com",
      port: 587,
      secure: true,
    },
    setupInstructions: "Use an app-specific password from your Apple ID settings.",
  },
  protonmail: {
    name: "ProtonMail",
    provider: "protonmail",
    imap: {
      host: "127.0.0.1",
      port: 1143,
      secure: false,
    },
    smtp: {
      host: "127.0.0.1",
      port: 1025,
      secure: false,
    },
    setupInstructions: "ProtonMail requires the ProtonMail Bridge app running locally. Configure the Bridge first.",
  },
};

export function detectProvider(email: string): EmailProviderConfig | null {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;

  if (domain === "gmail.com" || domain === "googlemail.com") {
    return EMAIL_PROVIDERS.gmail;
  } else if (
    domain === "outlook.com" ||
    domain === "hotmail.com" ||
    domain === "live.com" ||
    domain === "office365.com"
  ) {
    return EMAIL_PROVIDERS.outlook;
  } else if (domain === "yahoo.com" || domain === "ymail.com") {
    return EMAIL_PROVIDERS.yahoo;
  } else if (domain === "icloud.com" || domain === "me.com" || domain === "mac.com") {
    return EMAIL_PROVIDERS.icloud;
  } else if (domain === "protonmail.com" || domain === "pm.me") {
    return EMAIL_PROVIDERS.protonmail;
  }

  return null;
}

export function getCustomProviderDefaults(): Omit<EmailProviderConfig, "name"> {
  return {
    provider: "custom",
    imap: {
      host: "",
      port: 993,
      secure: true,
    },
    smtp: {
      host: "",
      port: 465,
      secure: true,
    },
    setupInstructions: "Enter your custom email server settings. Contact your email administrator if unsure.",
  };
}
