/**
 * Centralized Site and Brand Configuration
 * Single source of truth for branding, metadata, contact info, and site settings.
 */

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Shyam RO",
  brandName: process.env.NEXT_PUBLIC_COMPANY_NAME || "Shyam RO",
  shortName: "ShyamRO",
  tagline: "Pure Water for Healthy Life",
  description:
    "India's most trusted custom RO water purifiers, water purification systems, filter components, doorstep service, and AMC maintenance.",
  url: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  
  // Contact Information
  contact: {
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91-9876543210",
    phoneDisplay: "+91-9876543210",
    phoneSecondary: "+91-9998887776",
    whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "8252590019",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@shyamro.com",
    address: "Ballabhgarh, Faridabad, Haryana – 121004",
  },

  // Social and External Links
  social: {
    youtube: "https://youtube.com/@shyamro",
    youtubeName: "Shyam RO",
  },

  // Trust & Achievement Stats
  stats: {
    clients: "25,000+",
    sinceYear: "1999",
    experienceYears: "20+",
    subscribers: "1,00,000+",
    views: "2M+",
    happyPeople: "10M+",
    rating: "4.88",
  },

  // Navigation Links
  navLinks: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Custom RO", href: "/custom-room" },
    { label: "AMC Enquiry", href: "/amc-enquiry" },
    { label: "Certificates", href: "/certificates" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};

export default siteConfig;
