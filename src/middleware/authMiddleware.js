import { getServerSession } from "next-auth";

export const requireAuth = async (req, res, next) => {
  const session = await getServerSession(req, res);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  next();
};
