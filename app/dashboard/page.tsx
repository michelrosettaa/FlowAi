import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        Welcome {session.user?.name}
      </h1>
    </div>
  );
}

