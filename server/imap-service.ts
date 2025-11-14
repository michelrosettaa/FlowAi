import Imap from "imap";
import { simpleParser, ParsedMail } from "mailparser";
import { decryptPassword } from "./crypto-utils";

export interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
}

export interface ImapConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  tls: boolean;
}

export class ImapService {
  private config: ImapConfig;

  constructor(config: ImapConfig) {
    this.config = config;
  }

  async fetchInbox(maxMessages: number = 50): Promise<EmailMessage[]> {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: this.config.user,
        password: this.config.password,
        host: this.config.host,
        port: this.config.port,
        tls: this.config.tls,
      });

      const messages: EmailMessage[] = [];

      imap.once("ready", () => {
        imap.openBox("INBOX", true, (err, box) => {
          if (err) {
            imap.end();
            return reject(err);
          }

          const totalMessages = box.messages.total;
          if (totalMessages === 0) {
            imap.end();
            return resolve([]);
          }

          const start = Math.max(1, totalMessages - maxMessages + 1);
          const end = totalMessages;

          const fetch = imap.seq.fetch(`${start}:${end}`, {
            bodies: "",
            struct: true,
          });

          fetch.on("message", (msg) => {
            let buffer = "";

            msg.on("body", (stream) => {
              stream.on("data", (chunk) => {
                buffer += chunk.toString("utf8");
              });
            });

            msg.once("end", async () => {
              try {
                const parsed: ParsedMail = await simpleParser(buffer);
                
                const htmlBody = parsed.html || "";
                const textBody = parsed.text || "";
                const bodyText = textBody || this.stripHtml(htmlBody);
                const truncatedBody = bodyText.substring(0, 2000);

                messages.push({
                  id: parsed.messageId || `msg-${Date.now()}-${Math.random()}`,
                  from: this.extractEmailAddress(parsed.from?.text || ""),
                  subject: parsed.subject || "(No Subject)",
                  snippet: truncatedBody.substring(0, 150),
                  date: parsed.date ? parsed.date.toISOString() : new Date().toISOString(),
                  body: truncatedBody,
                });
              } catch (parseError) {
                console.error("Error parsing email:", parseError);
              }
            });
          });

          fetch.once("error", (fetchErr) => {
            console.error("Fetch error:", fetchErr);
            imap.end();
            reject(fetchErr);
          });

          fetch.once("end", () => {
            imap.end();
            resolve(messages.reverse());
          });
        });
      });

      imap.once("error", (err) => {
        console.error("IMAP error:", err);
        reject(err);
      });

      imap.once("end", () => {
        console.log("IMAP connection ended");
      });

      try {
        imap.connect();
      } catch (connectError) {
        reject(connectError);
      }
    });
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  private extractEmailAddress(fromField: string): string {
    const match = fromField.match(/<(.+?)>/);
    if (match) {
      return `${fromField.split("<")[0].trim()} <${match[1]}>`;
    }
    return fromField;
  }
}

export function createImapService(emailAccount: {
  emailAddress: string;
  password: string;
  imapHost: string;
  imapPort: number;
  imapSecure: boolean;
}): ImapService {
  const decryptedPassword = decryptPassword(emailAccount.password);
  
  return new ImapService({
    user: emailAccount.emailAddress,
    password: decryptedPassword,
    host: emailAccount.imapHost,
    port: emailAccount.imapPort,
    tls: emailAccount.imapSecure,
  });
}
