"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Mail, CheckCircle2 } from "lucide-react";

export default function VerifyPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.endsWith(".ac.uk") && !email.endsWith(".edu")) {
      alert("Please use a valid university email (.ac.uk or .edu)");
      return;
    }

    const actionCodeSettings = {
      url: "http://localhost:3000/verify-confirm", // update this after deployment
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForVerification", email);
      setSent(true);
    } catch (error) {
      console.error(error);
      alert("Error sending verification email. Try again later.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top_right,_#eef2ff,_#f9fafb_60%,_#ffffff_100%)] text-slate-800 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/70 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {!sent ? (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Verify Your Student Status 🎓
            </h1>
            <p className="text-slate-600 text-sm mb-6">
              Enter your university email to unlock your{" "}
              <b>£6.99/month student discount</b>.  
              You’ll need to reconfirm once a year.
            </p>

            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="flex items-center border border-slate-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <Mail size={18} className="ml-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@university.ac.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 p-2 bg-transparent text-sm text-slate-700 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold py-2.5 rounded-lg text-sm hover:scale-[1.02] transition-transform shadow-md"
              >
                Send Verification Email
              </button>
            </form>

            <p className="text-[11px] text-slate-400 mt-4">
              Only verified student emails (ending in <code>.ac.uk</code> or{" "}
              <code>.edu</code>) are eligible.
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle2 className="mx-auto text-green-500 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Verification Email Sent!
            </h2>
            <p className="text-slate-600 text-sm mb-4">
              A link has been sent to{" "}
              <b className="text-slate-800">{email}</b>.  
              Please click the link in your inbox to verify your student status.
            </p>

            <p className="text-[11px] text-slate-400 mt-4">
              Didn’t get the email? Check your spam or try again later.
            </p>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
