"use client";

import { authClient } from "@/src/lib/auth-client";


export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {session ? (
        <h1>Welcome {session.user.name}</h1>
      ) : (
        <h1>Not authenticated</h1>
      )}
    </div>
  );
}
