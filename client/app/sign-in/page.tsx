"use client";

import { authClient } from "@/src/lib/auth-client";

export default function SignInPage() {
  const handleGithubLogin = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:3001/dashboard?welcome=1",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={handleGithubLogin}
        className="rounded-md border px-4 py-2"
      >
        Continue with GitHub
      </button>
    </div>
  );
}
