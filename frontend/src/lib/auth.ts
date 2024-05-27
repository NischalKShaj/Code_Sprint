// file for the configuration for googleAuth and githubAuth
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
      if (account?.provider === "google") {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/google`,
            user
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
            user
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
  },
};
