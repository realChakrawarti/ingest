"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { useAuth } from "./context-provider";

export default function withAuth(WrappedComponent: React.ComponentType<any>) {
  return function WithAuth(props: any & { children?: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user && !loading) {
        router.push("/");
      }
    }, [user]);

    return <WrappedComponent {...props} />;
  };
}
