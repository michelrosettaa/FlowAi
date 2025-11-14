// Family & Friends Beta - Access Control
// Set to 'open' to allow anyone with the link
// Set to 'allowlist' to restrict to specific emails only

export const ACCESS_MODE: 'open' | 'allowlist' = 'open';

export const ALLOWED_EMAILS = new Set<string>([
  // Only used if ACCESS_MODE is set to 'allowlist'
  // Add your family and friends emails here:
  // "mom@example.com",
  // "dad@example.com",
]);

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  
  // Open access mode - anyone can log in
  if (ACCESS_MODE === 'open') {
    return true;
  }
  
  // Allowlist mode - only specific emails
  return ALLOWED_EMAILS.has(email.toLowerCase());
}
