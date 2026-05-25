import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-google-client-secret",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@writeflow.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Clean user email and password
        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        // Exact credentials requested by Phase 1
        if (email === "admin@writeflow.com" && password === "123456") {
          return {
            id: "admin-phase1",
            name: "Alexander Admin",
            email: "admin@writeflow.com",
            role: "ADMIN",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          };
        }

        if (email === "user@writeflow.com" && password === "123456") {
          return {
            id: "user-phase1",
            name: "John Writer",
            email: "user@writeflow.com",
            role: "USER",
            image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
          };
        }

        // Fallback Mock accounts for development/testing
        if (email === "admin@writeflow.ai" && password === "password123") {
          return {
            id: "admin-1",
            name: "Alexander Admin",
            email: "admin@writeflow.ai",
            role: "ADMIN",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          };
        }

        if (email === "user@writeflow.ai" && password === "password123") {
          return {
            id: "user-1",
            name: "John Writer",
            email: "user@writeflow.ai",
            role: "USER",
            image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80"
          };
        }

        // Standard dummy response for register simulation or valid logins
        if (password.length >= 6) {
          return {
            id: "simulated-id",
            name: email.split("@")[0].toUpperCase(),
            email: email,
            role: "USER",
            image: null
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "USER";
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET || "writeflow-super-secret-key-12345"
};
export default authOptions;
