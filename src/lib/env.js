/**
 * Environment Variables Validator and Accessor
 * Ensures required environment variables exist and provides clear error messages.
 */

const requiredServerEnv = [
  // Database
  { key: "MONGODB_URI", fallbackKey: "PROJECT_URL" },
];

const optionalServerEnv = [
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "MAIL_HOST",
  "MAIL_AUTH",
  "MAIL_PASS",
  "GROQ_API_KEY",
];

export function validateEnv() {
  if (typeof window !== "undefined") return { isValid: true, missing: [] };

  const missing = [];

  for (const envDef of requiredServerEnv) {
    const val = process.env[envDef.key] || (envDef.fallbackKey && process.env[envDef.fallbackKey]);
    if (!val) {
      missing.push(envDef.key);
    }
  }

  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    console.warn(`[ENV WARNING] Missing critical environment variables: ${missing.join(", ")}`);
  }

  return {
    isValid: missing.length === 0,
    missing,
  };
}

export const env = {
  // Database URI with fallback
  get mongodbUri() {
    return process.env.MONGODB_URI || process.env.PROJECT_URL || "mongodb://127.0.0.1:27017/shyam_ro_db";
  },

  // NextAuth
  get nextAuthSecret() {
    return process.env.NEXTAUTH_SECRET || "development-secret-key-change-in-production";
  },
  get nextAuthUrl() {
    return process.env.NEXTAUTH_URL || process.env.PORT_NO || "http://localhost:3000";
  },

  // Google OAuth
  get googleClientId() {
    return process.env.GOOGLE_CLIENT_ID || "";
  },
  get googleClientSecret() {
    return process.env.GOOGLE_CLIENT_SECRET || "";
  },

  // Razorpay
  get razorpayKeyId() {
    return process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  },
  get razorpayKeySecret() {
    return process.env.RAZORPAY_KEY_SECRET || "";
  },

  // Mail
  get mailHost() {
    return process.env.MAIL_HOST || process.env.EMAIL_SERVER_HOST || "";
  },
  get mailPort() {
    return parseInt(process.env.MAIL_PORT || process.env.EMAIL_SERVER_PORT || "587", 10);
  },
  get mailUser() {
    return process.env.MAIL_AUTH || process.env.EMAIL_SERVER_USER || "";
  },
  get mailPass() {
    return process.env.MAIL_PASS || process.env.EMAIL_SERVER_PASSWORD || "";
  },
  get mailFrom() {
    return process.env.EMAIL_FROM || process.env.MAIL_AUTH || "no-reply@shyamro.com";
  },

  // Cloudinary
  get cloudinaryCloudName() {
    return process.env.CLOUDINARY_CLOUD_NAME || "";
  },
  get cloudinaryApiKey() {
    return process.env.CLOUDINARY_API_KEY || "";
  },
  get cloudinaryApiSecret() {
    return process.env.CLOUDINARY_API_SECRET || "";
  },

  // AI Chatbot
  get groqApiKey() {
    return process.env.GROQ_API_KEY || "";
  },

  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV !== "production",
};

export default env;
