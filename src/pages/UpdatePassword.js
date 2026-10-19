"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import SEO from "@/src/components/SEO";

const UpdatePassword = () => {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });




  const [loading, setLoading] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const toggleVisibility = (field) => {
    setVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRegex.test(form.newPassword)) {
      return toast.error(
        "Password must be 8+ characters with uppercase, lowercase, number & symbol."
      );
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("New password and confirm password do not match.");
    }

    try {
      setLoading(true);
      const res = await axios.put("/api/auth/update-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success(res.data.message || "Password updated successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };


  if (session?.user?.role === "customer") {

    return <p className="text-center text-blue-400 bg-blue-50 py-72">You signed in via Google. Password change is not applicable.</p>;
  }
  return (
    <>
      <SEO
        title="Update Password"
        description="Update your account password for Shyam RO."
        noindex={true}
      />
      <div className="min-h-screen flex items-center justify-center bg-blue-50 py-16 px-4">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-blue-100 text-gray-700 shadow-lg rounded-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-blue-700 text-center">Update Password</h2>

        {/* Current Password */}
        <div className="relative">
          <input
            type={visible.current ? "text" : "password"}
            name="currentPassword"
            placeholder="Current Password"
            required
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => toggleVisibility("current")}
            className="absolute top-2.5 right-3 text-gray-500"
          >
            {visible.current ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={visible.new ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            required
            value={form.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => toggleVisibility("new")}
            className="absolute top-2.5 right-3 text-gray-500"
          >
            {visible.new ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <input
            type={visible.confirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => toggleVisibility("confirm")}
            className="absolute top-2.5 right-3 text-gray-500"
          >
            {visible.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
    </>
  );
};

export default UpdatePassword;
