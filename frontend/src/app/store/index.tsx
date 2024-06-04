// file to manage the state of the entire application
import { create } from "zustand";

// creating the interface for the state of the application
interface State {
  // users state
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
  // admin state
  isAdmin: boolean;
  admin: {
    email: string;
  } | null;
  isAdminLoggedIn: (admin: { email: string }) => void;
  isAdminLoggedOut: () => void;
  // getting all data required for the dashboard
  allUser: {
    id: string;
    username: string;
    email: string;
    profileImage: string;
    block: boolean;
  }[];
  findAllUsers: (
    allUser: {
      id: string;
      username: string;
      email: string;
      profileImage: string;
      block: boolean;
    }[]
  ) => void;
  allTutor: {
    id: string;
    username: string;
    email: string;
    profileImage: string;
    block: boolean;
  }[];
  findAllTutor: (
    allTutor: {
      id: string;
      username: string;
      email: string;
      profileImage: string;
      block: boolean;
    }[]
  ) => void;

  // for performing block and unblocks for tutor
  blockUnblock: (id: string, status: boolean) => void;

  // for performing block and unblock for user
  block_unblock: (id: string, status: boolean) => void;
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
      isAdmin: false,
      admin: null,
      allUser: [],
      allTutor: [],
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
          JSON.stringify({ ...get(), isAuthorized: true, user })
        );
      },
      isLoggedOut: () => {
        set(() => ({ isAuthorized: false, user: null }));
        // Save state to localStorage
        localStorage.setItem(
          "appState",
          JSON.stringify({ ...get(), isAuthorized: false, user: null })
        );
      },
      isAdminLoggedIn: (admin) => {
        set(() => ({ isAdmin: true, admin }));
        // saving the state to the local storage
        localStorage.setItem(
          "appState",
          JSON.stringify({ ...get(), isAdmin: true, admin })
        );
      },
      isAdminLoggedOut: () => {
        set(() => ({ isAdmin: false, admin: null }));
        // saving the state to the local storage
        localStorage.setItem(
          "appState",
          JSON.stringify({ ...get(), isAdmin: false, admin: null })
        );
      },
      findAllUsers(allUser) {
        set(() => ({ allUser }));
        localStorage.setItem("appState", JSON.stringify({ ...get(), allUser }));
      },
      findAllTutor(allTutor) {
        set(() => ({ allTutor }));
        localStorage.setItem(
          "appState",
          JSON.stringify({ ...get(), allTutor })
        );
      },
      blockUnblock: (id: string, status: boolean) => {
        set((state) => {
          const updatedTutors = state.allTutor.map((tutor) =>
            tutor.id === id ? { ...tutor, block: status } : tutor
          );
          return { ...state, allTutor: updatedTutors };
        });
      },
      block_unblock: (id: string, status: boolean) => {
        set((state) => {
          const updatedUser = state.allUser.map((user) =>
            user.id === id ? { ...user, block: status } : user
          );
          return { ...state, allUser: updatedUser };
        });
      },
    };
  } else {
    // Fallback or alternative behavior for non-browser environments
    return {
      isAuthorized: false,
      user: null,
      isLoggedIn: () => {},
      isLoggedOut: () => {},
      isAdmin: false,
      admin: null,
      isAdminLoggedIn: () => {},
      isAdminLoggedOut: () => {},
      allUser: [],
      findAllUsers: () => {},
      allTutor: [],
      findAllTutor: () => {},
      blockUnblock: () => {},
      block_unblock: () => {},
    };
  }
});
