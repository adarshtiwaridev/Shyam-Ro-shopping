import dbConnect from '../../../lib/dbConnect';
import users from '../../../models/users';
import bcrypt from "bcryptjs";
import { serialize } from "cookie";
export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

      // Set cookie
    const cookie = serialize("customUser", JSON.stringify({
      id: user._id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
      image: user.image || "/images/avatar.png",
      mobile: user.mobile,
      role: user.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    res.setHeader("Set-Cookie", cookie);
    return res.status(200).json({ message: "Login successful", user: {
      id: user._id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
      image: user.image || "/images/avatar.png",
      mobile: user.mobile,
      role: user.role,
    } });


  } catch (err) {
    return res.status(500).json({ message: "Login failed", error: err.message });
  }
}
