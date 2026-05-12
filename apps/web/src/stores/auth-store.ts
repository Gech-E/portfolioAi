import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@portfolioai/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Helper to set or clear the `portfolioai_session` cookie.
 * This cookie is read by the Next.js middleware to gate protected routes.
 * It carries no secret — it's only a flag; the real auth is the JWT.
 */
function setSessionCookie(active: boolean) {
  if (typeof document === 'undefined') return;
  if (active) {
    // Session cookie (no max-age → deleted when browser closes) OR set 7d like the refresh token
    document.cookie = 'portfolioai_session=1; path=/; max-age=' + 7 * 24 * 60 * 60 + '; SameSite=Lax';
  } else {
    // Clear cookie
    document.cookie = 'portfolioai_session=; path=/; max-age=0; SameSite=Lax';
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      login: (user, accessToken) => {
        setSessionCookie(true);
        set({ user, accessToken, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        setSessionCookie(false);
        // Also clear the persisted localStorage entry to fully sign out
        if (typeof window !== 'undefined') {
          localStorage.removeItem('portfolioai-auth');
        }
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'portfolioai-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
