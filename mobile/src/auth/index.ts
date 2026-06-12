"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "./api";
import type { User, Studio } from "./types";

const TOKEN_KEY = "nailstudio_token";
const USER_KEY = "nailstudio_user";
const STUDIO_KEY = "nailstudio_studio";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(STUDIO_KEY);
}

interface AuthContextType {
  user: User | null;
  studio: Studio | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  studioName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  studio: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [studio, setStudio] = useState<Studio | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      setTokenState(savedToken);
      try {
        const savedUser = localStorage.getItem(USER_KEY);
        const savedStudio = localStorage.getItem(STUDIO_KEY);
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedStudio) setStudio(JSON.parse(savedStudio));
      } catch {}
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    setStudio(data.studio);
    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(STUDIO_KEY, JSON.stringify(data.studio));
  }, []);

  const register = useCallback(async (regData: RegisterData) => {
    const { data } = await api.post("/auth/register", regData);
    setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
    setStudio(data.studio);
    setToken(data.token);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(STUDIO_KEY, JSON.stringify(data.studio));
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
    setStudio(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, studio, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
