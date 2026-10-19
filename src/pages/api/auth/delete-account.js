 

import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/users';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import { parse } from "cookie";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  const cookies = parse(req.headers.cookie || "");
  const customUser = cookies.customUser ? JSON.parse(cookies.customUser) : null;

 
  const userId = customUser?.id;
  const userEmail = session?.user?.email;

  if (!userId && !userEmail) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
   
    if (userId) {
      await User.findByIdAndDelete(userId);
    }
 
    if (userEmail) {
      await User.findOneAndDelete({ email: userEmail });
    }

    
    res.setHeader("Set-Cookie", [
      serialize("customUser", "", {
        path: "/",
        maxAge: -1,
      }),
    ]);

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Error deleting account", error: error.message });
  }
}
