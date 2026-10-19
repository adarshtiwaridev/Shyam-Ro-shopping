import { getServerSession } from "next-auth/next";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import { parse } from "cookie";
import dbConnect from "./dbConnect";
import User from "../models/users";

/**
 * Get authenticated user from either NextAuth session or customUser cookie.
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 * @returns {Promise<Object|null>} user object or null
 */
export async function getAuthenticatedUser(req, res) {
  try {
    // 1. Try NextAuth session
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.email) {
      await dbConnect();
      const dbUser = await User.findOne({ email: session.user.email }).select("-password");
      if (dbUser) return dbUser;
    }

    // 2. Try customUser cookie
    const cookies = parse(req.headers.cookie || "");
    if (cookies.customUser) {
      const parsed = JSON.parse(cookies.customUser);
      if (parsed?.id) {
        await dbConnect();
        const dbUser = await User.findById(parsed.id).select("-password");
        if (dbUser) return dbUser;
      }
    }
  } catch (error) {
    console.error("Auth helper error:", error.message);
  }

  return null;
}

/**
 * Verify if the caller is an admin or microadmin.
 * Returns { authorized: boolean, user?: Object, status?: number, message?: string }
 */
export async function verifyAdminAccess(req, res) {
  const user = await getAuthenticatedUser(req, res);
  if (!user) {
    return {
      authorized: false,
      status: 401,
      message: "Authentication required. Please log in.",
    };
  }

  if (user.role !== "admin" && user.role !== "microadmin") {
    return {
      authorized: false,
      status: 403,
      message: "Forbidden: Admin or Microadmin privileges required.",
    };
  }

  return { authorized: true, user };
}
