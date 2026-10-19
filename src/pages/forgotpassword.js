"use client";
import React, { useState, useEffect } from "react";
import { BiArrowFromRight } from "react-icons/bi";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import SEO from "@/src/components/SEO";

export default function ForgotPassword() {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const [emailsend, setemailsend] = useState(false);
  const [email, setemail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const resetpasswordhandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await fetch("/api/auth/resetpasstoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await result.json();
      setLoading(false);

      if (result.ok) {
        setemailsend(true);
        toast.success("Reset email sent!");
      } else {
        toast.error(data.message || "Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <SEO
        title="Forgot Password"
        description="Reset your account password for Shyam RO."
        noindex={true}
      />
      <div className="min-h-screen bg-gray-100 relative  flex items-center justify-center lg:py-20  pt-20 px-4">
        <div className="bg-blue-200 shadow-xl rounded-2xl max-w-md w-full px-8 py-10 space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-700">
          {emailsend ? "Check Your Email" : "Reset Your Password"}
        </h2>

        {!emailsend ? (
          <>
            <p className="text-sm text-gray-600 text-center">
              Have no fear. We'll email you instructions to reset your password.
              If you don't have access to your email, we can try account
              recovery.
            </p>

            <form onSubmit={resetpasswordhandler} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address <sup className="text-red-500">*</sup>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className="w-full px-4 py-2 mt-1 border border-blue-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-700 font-semibold placeholder:text-gray-500"
                  placeholder="myemailaddress@gmail.com"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 transition"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <p className="text-center text-blue-600 font-medium">
            We’ve sent a password reset link to <strong>{email}</strong>. Please
            check your inbox.
          </p>
        )}

        <Link
          href="/authpage"
          className="flex items-center justify-center gap-1 text-blue-600 hover:underline mt-4"
        >
          <BiArrowFromRight size={18} />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
    </>
  );
}
ForgotPassword.requireAuth = false;
