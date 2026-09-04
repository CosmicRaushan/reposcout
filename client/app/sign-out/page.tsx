"use client";
import Home from "../page";

import { authClient } from "@/src/lib/auth-client";

export default function SignOutPage() {
    const handleGithubLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    window.location.href = "/"
              }
          }
      })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Sign Out</h1>

        <p className="mb-6 text-sm text-muted-foreground">
          Are you sure you want to sign out of your account?
        </p>

        <div className="flex gap-3">
          <button className="flex-1 rounded-md border px-4 py-2">Cancel</button>

          <button
            onClick={handleGithubLogout}
            className="flex-1 rounded-md border px-4 py-2"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
