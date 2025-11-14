export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message) || error.message.includes("Unauthorized");
}

export function redirectToLogin() {
  window.location.href = "/api/login";
}
