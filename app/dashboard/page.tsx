import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Welcome {session.user?.name}</h1>
    </div>
  );
}
