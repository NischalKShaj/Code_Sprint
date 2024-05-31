// file to manage the state of the entire application
import { create } from "zustand";

interface State {
  isAuthorized: boolean;
  user: {
    id: string;
    email: string;
    role: string;
    username: string;
    profileImage: string;
  } | null;
  isLoggedIn: (user: {
    id: string;
    email: string;
    role: string;
    username: string;
    profileImage: string;
  }) => void;
  isLoggedOut: () => void;
}

export const AppState = create<State>((set, get) => {
  // Directly use typeof window!== "undefined" without useState
  if (typeof window !== "undefined") {
    // Safely read initial state from localStorage
    let savedState: string | null = localStorage.getItem("appState");

    // Initialize the state with defaults if savedState is null
    let initialState = {
      isAuthorized: false,
      user: null,
    };

    // Only parse savedState if it's not null
    if (savedState !== null) {
      try {
        initialState = JSON.parse(savedState);
      } catch (error) {
        console.error("Error parsing saved state:", error);
        // Optionally, fall back to initialState if parsing fails
      }
    }

    // Return the initial state along with the action handlers
    return {
      ...initialState,
      isLoggedIn: (user) => {
        set(() => ({ isAuthorized: true, user }));
        // Save state to localStorage
        localStorage.setItem(
          "appState",
          JSON.stringify({ isAuthorized: true, user })
        );
      },
      isLoggedOut: () => {
        set(() => ({ isAuthorized: false, user: null }));
        // Save state to localStorage
        localStorage.setItem(
          "appState",
          JSON.stringify({ isAuthorized: false, user: null })
        );
      },
    };
  } else {
    // Fallback or alternative behavior for non-browser environments
    return {
      isAuthorized: false,
      user: null,
      isLoggedIn: () => {},
      isLoggedOut: () => {},
    };
  }
});
