import { useRouter } from "next/navigation";

export function useClickUpAuth() {
  const router = useRouter();

  const login = () => {
    // Redirect to ClickUp OAuth
    window.location.href = "/auth/clickup";
  };

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/");
  };

  return {
    login,
    logout,
  };
}