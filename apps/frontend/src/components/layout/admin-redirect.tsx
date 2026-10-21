"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Admins only use /admin and /settings; send them back to /admin from any other dashboard page.
export function AdminRedirect({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin && !pathname.startsWith("/admin") && !pathname.startsWith("/settings")) {
      router.replace("/admin");
    }
  }, [isAdmin, pathname, router]);

  return null;
}
