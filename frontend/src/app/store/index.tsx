// file to manage the state of the entire application
import { create } from "zustand";
// creating the interface for the application
interface State {
  isAuthorized: boolean;
  user: { email: string } | null;
  isLoggedIn: (user: { email: string }) => void;
  isLoggedOut: () => void;
}

// creating store for the application
export const AppState = create<State>((set) => ({
  isAuthorized: false,
  user: null,
  isLoggedIn: (user) => set({ isAuthorized: true, user }),
  isLoggedOut: () => set({ isAuthorized: false, user: null }),
}));
