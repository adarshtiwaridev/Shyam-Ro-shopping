"use client";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/slices/authSlice";
import { signOut } from "next-auth/react";
import SEO from "@/src/components/SEO";

const DeleteAccount = () => {
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirm !== "DELETE") {
      toast.error("You must type DELETE to confirm.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.delete("/api/auth/delete-account");
      toast.success(res.data.message || "Account deleted.");
      dispatch(clearUser());
      await signOut({ redirect: false });
      router.push("/authpage");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Delete Account"
        description="Permanently delete your Shyam RO account."
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-6 py-20">
        <form onSubmit={handleDelete} className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md space-y-6 border border-red-200">
          <h2 className="text-2xl font-bold text-center text-red-600">Delete Account</h2>
          <p className="text-center text-gray-600">
            This action is <strong>permanent</strong>. Type <code className="bg-gray-100 px-1 py-0.5 rounded">DELETE</code> to confirm.
          </p>

          <input
            type="text"
            placeholder="Type DELETE to confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 text-black border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </form>
      </div>
    </>
  );
};

DeleteAccount.requireAuth = true;

export default DeleteAccount;
