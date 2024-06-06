import { NextAuthOptions } from "next-auth";
import dotenv from "dotenv";
dotenv.config();

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const { email, image, name } = user;
      if (account?.provider === "google") {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/google`,
            { email, image, name }
          );
          if (response.status !== 200) {
            throw new Error("backend failed to load the user details");
          }
        } catch (error) {
          console.error("error", error);
        }
      } else if (account?.provider === "github") {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/github`,
            { email, name, image }
          );
          if (response.status !== 200) {
            throw new Error("backend failed to load the user details");
          }
        } catch (error) {
          console.error("error", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.image = user.image as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
};
