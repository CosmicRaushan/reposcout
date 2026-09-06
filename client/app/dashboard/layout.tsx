"use client";

import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && !isPending) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div>Loading.....</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
