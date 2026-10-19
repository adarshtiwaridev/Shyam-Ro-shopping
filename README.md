# Shyam RO - E-Commerce & Water Purification Solutions Platform

A full-stack, enterprise-grade e-commerce and service management platform for **Shyam RO** built on **Next.js**, **React**, **Redux Toolkit**, **Tailwind CSS**, and **MongoDB / Mongoose**.

---

## 🌟 Key Features

### 🛒 E-Commerce & Product Catalog
- **Multi-Category Water Purifiers & Spares:** Browse RO systems, alkaline purifiers, UV/UF units, filters, and membranes with live stock checking.
- **Custom RO Configurator:** Interactive component builder for customized water purifiers with custom filters, cabinets, and TDS parameters.
- **Dynamic Cart & Checkout:** Persistent Redux-backed shopping cart with auto `localStorage` synchronization and dual authentication support.
- **Online & COD Payments:** Seamless Razorpay payment gateway integration with webhooks and Cash on Delivery support.

### 🛠️ Services & Maintenance (AMC)
- **Annual Maintenance Contract (AMC) Enquiries:** Customer portal to schedule RO maintenance, filter replacements, and membrane servicing.
- **Automated Email Notifications:** Multi-transport email dispatcher with branded HTML templates for account OTPs, password resets, and AMC notifications.
- **AI AquaBot Assistant:** Integrated conversational assistant helping customers diagnose RO purifier issues and pick the right filter model.

### 🔐 Authentication & Security
- **Dual Authentication System:** NextAuth.js (Google OAuth) + Custom JWT/Session Cookie authentication.
- **Role-Based Access Control (RBAC):** Strict authorization protecting admin endpoints (`admin`, `microadmin`, and `customer` roles).
- **Password & Account Lifecycle:** Cryptographically secure `bcryptjs` hashing, 6-digit OTP verification, secure password reset tokens, and account deletion flows.

### 📊 Admin Operations & Analytics
- **Live Order Management:** Real-time tracking addresses, shipment status changes, order details modal, and print-ready invoices.
- **Visual Analytics:** Interactive Recharts-powered revenue, order quantity, and active user metrics with Weekly, Monthly, and Yearly aggregation.
- **Catalog Management:** Add and update products, categories, image assets with Cloudinary integration.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15 (Pages Router), React 18 |
| **State Management** | Redux Toolkit (`authSlice`, `cartSlice`, `orderSlice`) |
| **Database & ODM** | MongoDB with Mongoose 8 (Global cached connections) |
| **Authentication** | NextAuth v4 + Custom HTTP-only signed cookies |
| **Styling** | Vanilla Tailwind CSS 4, Framer Motion, Lucide Icons |
| **Payments** | Razorpay Node SDK & Checkout Modal |
| **File Storage** | Cloudinary API |
| **SEO & Meta** | Reusable SEO module with Canonical URLs, OG Tags, Twitter Cards |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root. Refer to `.env.example` for the complete specification.

```env
# Application & Branding
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Shyam RO"
NEXT_PUBLIC_COMPANY_NAME="Shyam RO"

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/shyamro?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-32-character-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Razorpay Payment Gateway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret_key

# Email Service (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_AUTH=your-email@gmail.com
MAIL_PASS=your-google-app-password
MAIL_FROM="Shyam RO <no-reply@shyamro.com>"

# Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Chatbot Assistant (Groq / OpenAI)
GROQ_API_KEY=your-groq-api-key
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.17.0
- MongoDB instance (local or Atlas)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd RoSite

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production
```bash
# Compile and create production bundle
npm run build

# Start production server
npm run start
```

---

## 🔒 Security Best Practices Implemented
1. **No Sensitive Data Leaks:** Frontend code never accesses database credentials or secret keys. Configuration is filtered through `src/lib/env.js`.
2. **MongoDB Connection Caching:** Prevents serverless connection pool exhaustion via `global.mongoose`.
3. **Protected Admin Routes:** All `/api/admin/*` routes verify session authenticity and admin privileges before performing mutations.
4. **Input Sanitization & Schema Validation:** Critical endpoints use Zod validation schemas (`src/lib/zodSchemas`).
5. **SEO & Privacy Controls:** Non-public dashboards, auth pages, and payment confirmation screens are marked with `noindex, nofollow` to prevent indexing of customer information.

---

## 📞 Support & Business Information
- **Brand:** Shyam RO
- **Support Email:** support@shyamro.com
- **Helpline:** +91-9876543210 / 8252590019
- **Address:** 123 Industrial Area, Water Solutions Hub, New Delhi, India

---
&copy; 2026 Shyam RO. All Rights Reserved.
# Shyam-Ro-shopping
