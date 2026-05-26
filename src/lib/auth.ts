import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { isDatabaseConnectionError } from "@/lib/db-error";
import { DEMO_USERS, ensureDemoUsers, findUserByEmail, verifyPassword } from "@/lib/users";

const hasGoogleOAuth =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== "dummy-google-client-id" &&
  process.env.GOOGLE_CLIENT_SECRET !== "dummy-google-client-secret";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(hasGoogleOAuth
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@writeflow.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.toLowerCase().trim();
        const password = credentials.password;

        try {
          await ensureDemoUsers();
          const user = await findUserByEmail(email);
          if (!user || !(await verifyPassword(password, user.password))) {
            return null;
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.avatar,
          };
        } catch (error) {
          if (!isDatabaseConnectionError(error)) throw error;
          const demo = DEMO_USERS.find((u) => u.email === email);
          if (!demo || password !== demo.password) return null;
          return {
            id: demo.id,
            name: demo.name,
            email: demo.email,
            role: demo.role,
            image: demo.avatar,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = (token.role as string) || "USER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "writeflow-super-secret-key-12345",
  debug: false,
};

export default authOptions;
