import { requireVerifiedBusiness } from "@/lib/auth-server";

export default async function VerifiedBusinessLayout({ children }: { children: React.ReactNode }) {
  await requireVerifiedBusiness();
  return <>{children}</>;
}
