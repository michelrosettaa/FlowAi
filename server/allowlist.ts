// Family & Friends Beta - Allowlist
// Add email addresses of people who should have access

export const ALLOWED_EMAILS = new Set([
  // Add your family and friends emails here:
  // "mom@example.com",
  // "dad@example.com",
  // "sister@example.com",
  // "bestfriend@example.com",
]);

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  
  // Allow all emails during development
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  
  return ALLOWED_EMAILS.has(email.toLowerCase());
}
