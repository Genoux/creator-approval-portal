import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { DashboardClient } from "./client";

export default async function DashboardPage() {
  const session = await getServerSession();

  // No session at all - redirect to login
  if (!session) {
    redirect("/");
  }

  return <DashboardClient session={session} />;
}
