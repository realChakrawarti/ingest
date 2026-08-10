"use client";

import { SiGmail } from "@icons-pack/react-simple-icons";

import { useAuth } from "~/features/auth/context-provider";
import { googleProvider } from "~/features/auth/service-providers";

import { Button } from "~/shared/ui/button";

import JustTip from "./just-the-tip";

export default function AuthButton() {
  const { authenticateWith } = useAuth();

  const signInWithGoogle = async () => {
    await authenticateWith(googleProvider);
  };

  return (
    <JustTip label="Login with Google">
      <Button
        className="flex w-max items-center justify-start gap-1 rounded-md border border-l-0 p-0 pr-2"
        variant="outline"
        onClick={signInWithGoogle}
      >
        <div className="flex h-full items-center justify-center rounded-md bg-[#EA4335] p-2">
          <SiGmail color="#FFF" className="size-full" />
        </div>
        <p className="tracking-wider">Google</p>
      </Button>
    </JustTip>
  );
}
