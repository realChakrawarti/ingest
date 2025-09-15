"use client";

import {
  type GithubAuthProvider,
  type GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { toast } from "sonner";

import fetchApi from "~/shared/lib/api/fetch";
import { Routes } from "~/shared/lib/constants";
import { client } from "~/shared/lib/firebase/client";
import Log from "~/shared/utils/terminal-logger";

type UserContext = {
  user: User | null;
  loading: boolean;
  authenticateWith: (
    _provider: GoogleAuthProvider | GithubAuthProvider
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<UserContext>({
  authenticateWith: () => Promise.resolve(),
  loading: true,
  logout: () => Promise.resolve(),
  user: null,
});

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const [userState, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useLayoutEffect(() => {
    const authStateChanged = async (user: User | null) => {
      const token = await user?.getIdToken();
      if (user && token) {
        setUserState(user);
        setLoading(false);
      } else {
        setUserState(null);
        setLoading(false);
      }
    };

    const unsubscribeFromAuth = onAuthStateChanged(
      client.auth,
      authStateChanged
    );

    return () => {
      unsubscribeFromAuth();
      setUserState(null);
    };
  }, []);

  async function authenticateWith(
    provider: GoogleAuthProvider | GithubAuthProvider
  ) {
    try {
      setLoading(true);
      const response = await signInWithPopup(client.auth, provider);
      const user = response.user;
      if (user) {
        const userToken = await user.getIdToken();
        const result = await fetchApi("/users", {
          body: JSON.stringify({ token: userToken }),
          method: "POST",
        });
        toast(result.message);
        router.push(Routes.DASHBOARD);
      }
    } catch (err) {
      Log.fail(JSON.stringify(err));
      setLoading(false);
    }
  }

  const logout = async () => {
    signOut(client.auth);
    const result = await fetchApi("/logout");
    toast(result.message);
    router.push(Routes.ROOT);
  };

  return (
    <AuthContext.Provider
      value={{ authenticateWith, loading, logout, user: userState }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
