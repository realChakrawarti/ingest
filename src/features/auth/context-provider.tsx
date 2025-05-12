"use client";

import {
  GithubAuthProvider,
  GoogleAuthProvider,
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

import { useToast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { auth } from "~/shared/lib/firebase/client";

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
  const { toast } = useToast();

  const [userState, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  useLayoutEffect(() => {
    const unsubscribeFromAuth = onAuthStateChanged(auth, authStateChanged);

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
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      if (user) {
        const result = await fetchApi("/users", {
          method: "POST",
          body: JSON.stringify({ uid: user.uid }),
        });
        toast({ title: result.message });
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(JSON.stringify(err));
      setLoading(false);
    }
  }

  const logout = async () => {
    signOut(auth);
    window.localStorage.clear();
    const result = await fetchApi("/logout");
    toast({ title: result.message });
    router.push("/");
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
