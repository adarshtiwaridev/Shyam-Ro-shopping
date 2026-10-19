import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../lib/dbConnect";
import users from "../../../models/users";
import { getOptimizedProfileImage, getSafeProfileImage } from "../../../lib/imageUtils";

export const authOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                // Use safe image URL to avoid rate limiting
                image: getSafeProfileImage(profile.picture, profile.name),
              };
            },
          }),
        ]
      : []),
  ],
  secret: process.env.NEXTAUTH_SECRET || "development-secret-key-change-in-production",

  // Add pages configuration to handle errors
  pages: {
    signIn: "/authpage",
    error: "/authpage", // Redirect to auth page on error
  },

  callbacks: {
    async signIn({ user, profile }) {
      try {
        await dbConnect();
        const existingUser = await users.findOne({ email: user.email });

        if (!existingUser) {
          // Use optimized image URL for database storage
          const optimizedImage = getOptimizedProfileImage({
            image: user.image,
            name: user.name,
            email: user.email,
          });

          await users.create({
            firstName: profile?.given_name || user.name?.split(" ")[0] || "User",
            lastName: profile?.family_name || user.name?.split(" ")[1] || "",
            email: user.email,
            image: optimizedImage,
            mobile: "",
            password: "",
            role: "customer",
          });
        } else {
          // Update existing user's image if it's a Google image (to fix rate limiting)
          if (existingUser.image && existingUser.image.includes("googleusercontent.com")) {
            const optimizedImage = getOptimizedProfileImage({
              image: user.image,
              name: user.name,
              email: user.email,
            });

            await users.findByIdAndUpdate(existingUser._id, {
              image: optimizedImage,
            });
          }
        }

        return true;
      } catch (error) {
        console.error("Error saving user to DB:", error);
        return false;
      }
    },

    async session({ session }) {
      try {
        await dbConnect();
        const dbUser = await users.findOne({ email: session.user.email });
        if (dbUser) {
          session.user.id = dbUser._id.toString();
          session.user.role = dbUser.role;
          session.user.mobile = dbUser.mobile;
          session.user.name = `${dbUser.firstName} ${dbUser.lastName}`.trim();

          // Ensure we're using a safe image URL
          session.user.image = getOptimizedProfileImage({
            image: dbUser.image,
            name: session.user.name,
            email: session.user.email,
          });
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
};

export default NextAuth(authOptions);
