// PATCH method to update name, mobile, photo
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/users';
 
export default async function handler(req, res) {
  if (req.method !== "PATCH") return res.status(405).json({ message: "Method not allowed" });
 await dbConnect();
 const profileForm = req.body;
 console.log("profileForm",profileForm)
if (!profileForm || !profileForm.email) {
  return res.status(400).json({ message: "Email is required" });
}

  try {
   const updatedUser = await User.findOneAndUpdate(
      { email: profileForm.email },
      {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        mobile: profileForm.mobile,
        image: profileForm.image,
      },
      { new: true }
    );

    return res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
 
   


}
 
 