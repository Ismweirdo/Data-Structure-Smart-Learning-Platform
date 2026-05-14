import { tokenStorage } from "@/api/client";
import type { TokenResponse, User } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setTokens: (tokens: Pick<TokenResponse, "access_token" | "refresh_token">) => void;
  setUser: (user: User | null) => void;
  setAuth: (
    tokens: Pick<TokenResponse, "access_token" | "refresh_token">,
    user?: User | null,
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!tokenStorage.getAccessToken(),
  setTokens: (tokens) => {
    tokenStorage.setTokens(tokens);
    set({ isAuthenticated: true });
  },
  setUser: (user) => set({ user }),
  setAuth: (tokens, user = null) => {
    tokenStorage.setTokens(tokens);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    tokenStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
}));
