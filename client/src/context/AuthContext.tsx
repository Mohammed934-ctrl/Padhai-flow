import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { axiosInstance } from "@/utils/axios";

interface User {
  id: string;
  name: string;
  email: string;
}
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    const storeToken = localStorage.getItem("token");
    const storeUser = localStorage.getItem("user");
    if (storeToken && storeUser) {
      setToken(storeToken);
      setUser(JSON.parse(storeUser));
    }
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${storeToken}`;

    setisLoading(false);
  }, []);
  const login = useCallback((token: string, user: User) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {}

    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    delete axiosInstance.defaults.headers.common["Authorization"];
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within Authprovider");
  }

  return context;
};
