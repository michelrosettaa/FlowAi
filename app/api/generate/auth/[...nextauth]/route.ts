

// Minimal setup for NextAuth (no providers yet)
const handler = NextAuth({
  providers: [],
});

export { handler as GET, handler as POST };
