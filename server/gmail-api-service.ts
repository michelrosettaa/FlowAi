import { google } from 'googleapis';
import { getUserTokens } from '@/lib/auth/tokens';

async function getGmailClient(userId: string) {
  try {
    const tokens = await getUserTokens(userId, 'google');
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
  } catch (error: any) {
    console.error('Gmail client error:', error);
    throw new Error('Gmail not connected. Please connect your Google account in settings.');
  }
}

export async function fetchGmailInbox(userId: string, maxResults: number = 10) {
  try {
    const gmail = await getGmailClient(userId);
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: 'in:inbox',
    });

    const messages = response.data.messages || [];
    
    if (messages.length === 0) {
      return [];
    }
    
    const emails: Array<{
      id: string;
      from: string;
      subject: string;
      snippet: string;
      date: string;
      body: string;
    }> = [];
    
    for (const message of messages) {
      try {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full',
        });

        const payload = msg.data.payload;
        const snippet = msg.data.snippet || '';
        
        if (!payload) {
          emails.push({
            id: message.id!,
            from: 'Unknown',
            subject: 'Email',
            snippet,
            date: new Date().toISOString(),
            body: snippet,
          });
          continue;
        }

        const headers = payload.headers || [];
        const fromHeader = headers.find(h => h.name === 'From');
        const subjectHeader = headers.find(h => h.name === 'Subject');
        const dateHeader = headers.find(h => h.name === 'Date');
        
        let body = '';
        
        try {
          const parts = payload.parts || [];
          for (const part of parts) {
            if (part.mimeType === 'text/plain' && part.body?.data) {
              body = Buffer.from(part.body.data, 'base64').toString('utf-8');
              break;
            }
          }
          
          if (!body && payload.body?.data) {
            body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
          }
        } catch (decodeError) {
          body = '';
        }
        
        body = body || snippet;
        
        if (body.length > 2000) {
          body = body.substring(0, 2000) + '...';
        }

        emails.push({
          id: message.id!,
          from: fromHeader?.value || 'Unknown',
          subject: subjectHeader?.value || 'No Subject',
          snippet,
          date: dateHeader?.value || new Date().toISOString(),
          body,
        });
      } catch (emailError) {
        console.warn(`Skipping email ${message.id} due to error`);
        continue;
      }
    }
    
    return emails;
  } catch (error: any) {
    console.error('Gmail API error:', error?.message || 'Unknown error');
    return [];
  }
}

export async function sendGmailEmail(userId: string, to: string, subject: string, body: string) {
  try {
    const gmail = await getGmailClient(userId);
    
    const raw = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      body,
    ].join('\r\n');

    const encodedMessage = Buffer.from(raw).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return true;
  } catch (error: any) {
    console.error('Gmail send error:', error);
    throw new Error(`Failed to send email via Gmail: ${error.message}`);
  }
}

export async function checkGmailConnection(userId: string): Promise<boolean> {
  try {
    await getUserTokens(userId, 'google');
    console.log("✅ Gmail OAuth connection active for user:", userId);
    return true;
  } catch (error: any) {
    console.log("ℹ️  Gmail OAuth not connected for user:", userId, error.message);
    return false;
  }
}
