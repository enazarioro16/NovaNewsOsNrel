import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@novanews/database";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as any, // Type cast to bypass strict beta types mismatch
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // En un MVP, aceptaremos un usuario dummy por defecto
        if (credentials.email === "admin@novanews.ai" && credentials.password === "admin") {
          return { id: "1", name: "NovaNews Admin", email: "admin@novanews.ai", role: "ADMIN" };
        }
        return null;
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    session({ session, token }) {
      (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
});
