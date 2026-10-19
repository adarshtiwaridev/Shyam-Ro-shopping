import { serialize } from "cookie";

export default function handler(req, res) {
  const cookie = serialize("customUser", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  res.setHeader("Set-Cookie", cookie);
  return res.status(200).json({ message: "Logged out" });
}
