import dbConnect from '../../../lib/dbConnect';
import users from '../../../models/users';
import Otp from '../../../models/Otp';
import { sendOTPEmail } from '../../../lib/nodemailer';
import { signupSchema } from '../../../lib/zodSchemas/userSchema';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const parsed = signupSchema.safeParse(req.body);
if (!parsed.success) {
  console.error("ZOD VALIDATION ERROR:", parsed.error.flatten());
  return res.status(400).json({ message: "Validation error", error: parsed.error });
}

    const { email } = parsed.data;

    const userExists = await users.findOne({ email });
    if (userExists) return res.status(409).json({ message: "User already exists" });



    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ email, code: otp, expiresAt: Date.now() + 10 * 60 * 1000 });

    await sendOTPEmail(email,otp);

    return res.status(201).json({ message: "Otp Sent Successfully" });
  }
  else if(req.method === "GET"){
 const { id } = req.query;
 console.log("id in signup route",id)
  if (!id) {
    return res.status(400).json({ success: false, message: "Missing user ID" });
  }

  try {
    const user = await users.findById(id).select("-password");  

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
  }

  return res.status(405).end("Method Not Allowed");
}
 
 