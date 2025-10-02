import { redirect } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreatorManagementProvider } from "@/contexts/CreatorManagementContext";
import { getServerSession } from "@/lib/auth";
import { hasAcknowledged } from "@/lib/disclaimer-actions";
import { LayoutClient } from "./layout-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // No session at all - redirect to login
  if (!session) {
    redirect("/");
  }

  // Check disclaimer once at the dashboard level
  const showDisclaimer = !(await hasAcknowledged());

  return (
    <AuthProvider session={session}>
      <CreatorManagementProvider>
        <LayoutClient showDisclaimer={showDisclaimer}>{children}</LayoutClient>
      </CreatorManagementProvider>
    </AuthProvider>
  );
}
