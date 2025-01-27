"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function OAuth() {
  const signInOAuth = async (provider: string) => {
    await signIn(provider, {
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <section>
      <Button variant="outline" size="lg" onClick={() => signInOAuth("google")}>
        Sign In With Google
        <Image
          src={"/google_logo.svg"}
          alt="google-logo"
          width={24}
          height={24}
        />
      </Button>
    </section>
  );
}
