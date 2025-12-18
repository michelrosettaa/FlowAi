import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  // Not signed in → go to signin
  if (!session) {
    redirect("/signin");
  }

  // Signed in but onboarding NOT completed
  if (!session.user.onboardingCompleted) {
    redirect("/onboarding");
  }

  // Signed in & onboarded → dashboard
  redirect("/dashboard");
}
