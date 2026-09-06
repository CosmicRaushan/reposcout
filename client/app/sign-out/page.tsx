"use client";

import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();
    const handleGithubLogout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
          router.push("/")
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
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 rounded-md border px-4 py-2"
          >
            Cancel
          </button>

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
