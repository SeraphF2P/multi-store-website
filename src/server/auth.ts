import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { sendVerificationRequest } from "../helpers/nodemailer";
import * as JWT from 'next-auth/jwt'
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      username: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    role: UserRole;
    username: string;

  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest(params) {
        sendVerificationRequest(params)
      },
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials.password) {
          return null;
        }
        const user = await db.user.findUniqueOrThrow({
          where: {
            username: credentials.username
          },
        });
        if (!user || !user.password) return null;

        const isValidPassword = await compare(credentials.password, user.password);

        if (!isValidPassword) return null;

        return {
          id: user.id,
          name: user.name || "",
          username: user.username || "",
          role: user.role || "guest",
          email: user.email || "",
        }

      },
    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          role: user.role
        }
      }

      return token
    },
    session: async ({ session, token }) => {


      return {
        ...session,
        user: {
          ...token,
        },
      }
    },

  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db),

};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
