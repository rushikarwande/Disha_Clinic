import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Models } from "appwrite";
import { appwriteAccount, isAppwriteConfigured } from "@/lib/appwrite";

type AuthContextValue = {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<Models.User<Models.Preferences> | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    if (!isAppwriteConfigured) {
      setUser(null);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);
    try {
      const currentUser = await appwriteAccount.get();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    await appwriteAccount.createEmailPasswordSession({ email, password });
    const currentUser = await refreshUser();

    if (!currentUser) {
      throw new Error(
        "Login session was created, but the user session could not be verified. Check the Appwrite web app hostname and cookie settings.",
      );
    }
  };

  const logout = async () => {
    if (!isAppwriteConfigured) {
      setUser(null);
      return;
    }

    await appwriteAccount.deleteSession("current");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isConfigured: isAppwriteConfigured,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
