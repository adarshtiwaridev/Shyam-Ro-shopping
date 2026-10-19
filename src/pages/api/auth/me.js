import { parse } from "cookie";
import dbConnect from '../../../lib/dbConnect';
import users from '../../../models/users';

export default async function handler(req, res) {
  await dbConnect();

  const { customUser } = parse(req.headers.cookie || "");

  if (!customUser) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const parsed = JSON.parse(customUser);
    const user = await users.findById(parsed.id).select("-password");
    console.log("user in cookie updated data",user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(400).json({ message: "Invalid cookie or DB error" });
  }
}
