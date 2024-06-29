// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import dotenv from "dotenv";
dotenv.config();

import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import axios, { AxiosError } from "axios"; // Import AxiosError for better error handling
import axiosRetry from "axios-retry"; // Import axios-retry for retry mechanism
import local from "local-storage";

// Create an axios instance with increased timeout
const axiosInstance = axios.create({
  timeout: 10000, // Increased timeout to 10 seconds
});

// Apply retry logic to axios instance
axiosRetry(axiosInstance, {
  retries: 3, // Number of retries
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff retry delay
  retryCondition: (error) =>
    axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error), // Retry on network errors or specific conditions
});

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const { email, image, name } = user;
      if (account?.provider === "google") {
        try {
          console.log("Attempting Google OAuth...");
          const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/google`,
            { email, image, name },
            { withCredentials: true }
          );
          console.log("Google OAuth successful", response);
          // Additional logic here...
        } catch (error: any) {
          console.error("Google OAuth error:", error);
          handleAxiosError(error); // Ensure this handles retry logic
        }
      } else if (account?.provider === "github") {
        try {
          const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/github`,
            { email, name, image },
            { withCredentials: true }
          );
          if (response.status !== 202) {
            throw new Error("Backend failed to load the user details");
          }
          const token = response.data.token;
          storeToken(token); // Store token locally
        } catch (error: any) {
          handleAxiosError(error); // Handle Axios error with a dedicated function
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

// Function to handle Axios errors
function handleAxiosError(error: AxiosError) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error(
        "Request made but server responded with status:",
        error.response.status
      );
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Request made but no response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error during request setup:", error.message);
    }
  } else {
    // Not an Axios error
    console.error("Non-Axios error occurred:", error);
  }
}

// Function to store token locally using local-storage
function storeToken(token: string) {
  // local.set("authToken", token);
  console.log("Token stored locally:", token);
}
