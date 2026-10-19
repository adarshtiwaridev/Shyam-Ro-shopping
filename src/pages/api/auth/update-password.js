import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/users';
import bcrypt from "bcryptjs";
import { parse } from "cookie";

export default async function handler(req, res) {
    if (req.method !== "PUT") return res.status(405).json({ message: "Method not allowed" });

    const { customUser } = parse(req.headers.cookie || "");
    if (!customUser) return res.status(401).json({ message: "Unauthorized" });

    await dbConnect();
    const { currentPassword, newPassword } = req.body;
    const userData = JSON.parse(customUser);

    const user = await User.findById(userData.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
}
