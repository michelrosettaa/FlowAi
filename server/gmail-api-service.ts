import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('Replit token not found');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-mail',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Gmail not connected');
  }
  return accessToken;
}

async function getGmailClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function fetchGmailInbox(userId: string, maxResults: number = 10) {
  try {
    const gmail = await getGmailClient();
    
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
    const gmail = await getGmailClient();
    
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
    await getAccessToken();
    console.log("✅ Gmail connection active via Replit integration");
    return true;
  } catch (error: any) {
    console.log("ℹ️  Gmail not connected:", error.message);
    return false;
  }
}
