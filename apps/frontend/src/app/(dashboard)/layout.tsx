import { sessionClaims } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { AdminRedirect } from "@/components/layout/admin-redirect";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, role } = await sessionClaims();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminRedirect isAdmin={role === "ADMIN"} />
      <DashboardHeader />

      <div className="flex min-h-[calc(100vh-56px)]">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
