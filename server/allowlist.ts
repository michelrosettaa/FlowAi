// Authentication Access Control
// Control who can sign up for your SaaS platform

// Get access mode from environment variable, defaulting to 'open' for testing
export const ACCESS_MODE: 'open' | 'allowlist' = 
  (process.env.REFRAIM_ACCESS_MODE as 'open' | 'allowlist') || 'open';

// Add approved email addresses here when using allowlist mode
// These are the only emails that will be allowed to create accounts
export const ALLOWED_EMAILS = new Set<string>([
  // Add your beta testers' emails here:
  // "tester1@example.com",
  // "tester2@example.com",
  // "your.email@example.com",
]);

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  
  // Open access mode - anyone can sign up
  // Use this for public launch
  if (ACCESS_MODE === 'open') {
    return true;
  }
  
  // Allowlist mode - only specific emails can sign up
  // Use this for private beta testing
  return ALLOWED_EMAILS.has(email.toLowerCase());
}

export function getAccessDeniedMessage(): string {
  return "This app is currently in private beta. Please contact the administrator for access.";
}
