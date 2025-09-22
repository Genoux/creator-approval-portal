import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { hasDisclaimerBeenAcknowledged } from "@/lib/disclaimer-actions";
import { DashboardClient } from "./client";

export default async function DashboardPage() {
  const session = await getServerSession();

  // No session at all - redirect to login
  if (!session) {
    redirect("/");
  }

  const showDisclaimer = !(await hasDisclaimerBeenAcknowledged());

  return <DashboardClient session={session} showDisclaimer={showDisclaimer} />;
}
