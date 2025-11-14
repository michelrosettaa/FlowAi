import { google } from 'googleapis';
import { getUserTokens } from '../auth/tokens';

export async function getCalendarClient(userId: string, provider: 'google' | 'microsoft-entra-id' = 'google') {
  if (provider === 'google') {
    const tokens = await getUserTokens(userId, 'google');
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: tokens.accessToken
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });
  } else if (provider === 'microsoft-entra-id') {
    throw new Error('Microsoft Graph calendar not yet implemented - coming soon');
  } else {
    throw new Error(`Unsupported calendar provider: ${provider}`);
  }
}
