import { redirect } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { CreatorDataProvider } from "@/contexts/CreatorDataContext";
import { ListSelectionProvider } from "@/contexts/ListSelectionContext";
import { getServerSession } from "@/lib/auth";
import { hasAcknowledged } from "@/lib/disclaimer-actions";
import { LayoutClient } from "./layout-client";

// Force dynamic rendering for authenticated routes
export const dynamic = "force-dynamic";

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
      <ListSelectionProvider>
        <CreatorDataProvider>
          <LayoutClient showDisclaimer={showDisclaimer}>
            {children}
          </LayoutClient>
        </CreatorDataProvider>
      </ListSelectionProvider>
    </AuthProvider>
  );
}
