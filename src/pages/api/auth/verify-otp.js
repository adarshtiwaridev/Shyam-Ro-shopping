import dbConnect from '../../../lib/dbConnect';
import bcrypt from 'bcryptjs';
import Otp from '../../../models/Otp';
import users from '../../../models/users';
import { signupSchema } from '../../../lib/zodSchemas/userSchema';
import { serialize } from "cookie";
export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { code, ...formData } = req.body;
    const parsed = signupSchema.safeParse(formData);
     if (!parsed.success) {
      return res.status(400).json({ message: "Validation error", error: parsed.error });
    }

    const { email, password } = parsed.data;

    const validOtp = await Otp.findOne({ email, code: code.toString() });

    if (!validOtp || validOtp.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const role =  "customer";
    const image = "/images/avatar.png";

  const userdata = await users.create({
      ...parsed.data,
      password: hashedPassword,
      image,
      role,
    });
    await Otp.deleteMany({ email });

     // Set cookie
    const cookie = serialize("customUser", JSON.stringify({
      id: userdata._id,
      email: userdata.email,
      name: userdata.firstName + " " + userdata.lastName,
      image: userdata.image || "/images/avatar.png",
      mobile: userdata.mobile,
      role: userdata.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
  res.setHeader("Set-Cookie", cookie);  

    return res.status(200).json({ message: "Email verified successfully" ,data:userdata});
  }

  res.status(405).end("Method Not Allowed");
}
