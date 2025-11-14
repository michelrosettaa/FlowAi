import nodemailer from "nodemailer";
import { decryptPassword } from "./crypto-utils";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class SmtpService {
  private transporter: nodemailer.Transporter;

  constructor(config: SmtpConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      from: this.transporter.options.auth?.user,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("SMTP verification failed:", error);
      return false;
    }
  }
}

export function createSmtpService(emailAccount: {
  emailAddress: string;
  password: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
}): SmtpService {
  const decryptedPassword = decryptPassword(emailAccount.password);
  
  return new SmtpService({
    host: emailAccount.smtpHost,
    port: emailAccount.smtpPort,
    secure: emailAccount.smtpSecure,
    auth: {
      user: emailAccount.emailAddress,
      pass: decryptedPassword,
    },
  });
}
