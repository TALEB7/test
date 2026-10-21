import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";


export async function auth() {
  const session = await getServerSession(authOptions);
  
  return {
    userId: session?.user ? (session.user as any).id : null,
    sessionId: session ? "session_123" : null,
    // Add other properties you might need
  };
}


// Route guards — these replace the old Edge middleware, which Vercel services can't run.
export async function sessionClaims() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  return {
    userId: user?.id ?? null,
    role: user?.role as string | undefined,
    accountType: user?.accountType as string | undefined,
    kycStatus: (user?.kycStatus as string | undefined) || "none",
  };
}

// Admin pages: signed-in non-admins go to /dashboard.
export async function requireAdmin() {
  const { userId, role } = await sessionClaims();
  if (!userId) redirect("/sign-in");
  if (role !== "ADMIN") redirect("/dashboard");
}

// KYB (vérification entreprise) is mandatory before platform access; personal KYC stays optional.
export async function requireVerifiedBusiness() {
  const { userId, accountType, kycStatus } = await sessionClaims();
  if (!userId) redirect("/sign-in");
  if (accountType === "business" && kycStatus !== "approved") {
    redirect("/onboarding/verify/pending");
  }
}

export async function currentUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return null;
  
  return {
    id: (session.user as any).id,
    firstName: (session.user as any).firstName || session.user.name?.split(" ")[0],
    lastName: (session.user as any).lastName || session.user.name?.split(" ")[1],
    emailAddresses: [{ emailAddress: session.user.email }],
    primaryEmailAddress: { emailAddress: session.user.email },
    imageUrl: session.user.image || "",
  };
}
