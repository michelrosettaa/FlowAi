"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../firebaseConfig";
import { signInWithEmailLink } from "firebase/auth";

export default function VerifyConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    const email = window.localStorage.getItem("emailForVerification");

    if (!email) return;

    signInWithEmailLink(auth, email, window.location.href)
      .then(() => {
        window.localStorage.removeItem("emailForVerification");
        router.push("/signup?verified=true");
      })
      .catch((error) => {
        console.error(error);
        alert("Verification failed. Please try again.");
      });
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center text-slate-800">
      <p>Verifying your email, please wait...</p>
    </main>
  );
}
