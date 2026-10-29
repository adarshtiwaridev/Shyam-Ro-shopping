# Shyam RO Shopping 💧

### E-Commerce & Water Purification Solutions Platform

Shyam RO Shopping is a full-stack e-commerce and service management platform designed to simplify the purchase, customization, and maintenance of water purification systems.

Built with **Next.js, React, Redux Toolkit, Tailwind CSS, and MongoDB**, the platform combines an intuitive shopping experience with secure payments, RO maintenance services, and comprehensive administrative tools.

Our goal is to make water purification products and maintenance services more accessible through a modern, reliable, and user-friendly digital platform.

---

## ✨ Key Features

### 🛒 E-Commerce & Product Catalog

* **Product Categories:** Explore RO water purifiers, alkaline purifiers, UV/UF systems, filters, membranes, and spare parts.
* **Custom RO Configurator:** Configure water purifiers using compatible components, cabinets, filters, and TDS parameters.
* **Smart Shopping Cart:** Manage cart items with Redux Toolkit and local storage persistence.
* **Secure Checkout:** Streamlined checkout experience with authentication support.
* **Multiple Payment Options:** Razorpay integration and Cash on Delivery support.
* **Product Availability:** Display product stock and availability information.

### 🛠️ RO Services & Maintenance

* **AMC Enquiries:** Submit requests for Annual Maintenance Contracts.
* **Maintenance Requests:** Request RO servicing, filter replacements, and membrane maintenance.
* **Email Notifications:** Branded email templates for account verification, password resets, and service notifications.
* **AI AquaBot:** Conversational assistance for troubleshooting RO issues and identifying suitable filters.

### 🔐 Authentication & Security

* Google OAuth authentication using NextAuth.js.
* Custom JWT and session-cookie authentication.
* Role-Based Access Control (RBAC) for administrators and customers.
* Secure password hashing with bcryptjs.
* Six-digit OTP verification.
* Password reset functionality.
* Account management and deletion workflows.
* Protected administrative APIs.

### 📊 Admin Dashboard & Analytics

* **Order Management:** View orders, manage order statuses, and track shipping information.
* **Invoice Generation:** Access order details and print-ready invoices.
* **Business Analytics:** Visualize revenue, order volume, and user activity.
* **Time-Based Reports:** Analyze weekly, monthly, and yearly metrics.
* **Product Management:** Add, edit, and manage product listings.
* **Category Management:** Organize products into relevant categories.
* **Cloudinary Integration:** Manage product images and media assets.

### 🔎 SEO & Performance

* Reusable SEO metadata configuration.
* Canonical URLs.
* Open Graph metadata for social sharing.
* Twitter Card metadata.
* Search-engine-friendly page structure.
* `noindex` directives for private account and administrative pages.
* Cached MongoDB connections to reduce unnecessary reconnections.

---

## 🧰 Technology Stack

| Layer             | Technology                                      |
| ----------------- | ----------------------------------------------- |
| Framework         | Next.js 15                                      |
| Frontend          | React 18                                        |
| Language          | JavaScript / TypeScript, as used in the project |
| State Management  | Redux Toolkit                                   |
| Styling           | Tailwind CSS 4                                  |
| Animations        | Framer Motion                                   |
| Icons             | Lucide React                                    |
| Database          | MongoDB                                         |
| ODM               | Mongoose 8                                      |
| Authentication    | NextAuth.js v4 and custom authentication        |
| Payments          | Razorpay                                        |
| Email             | Nodemailer                                      |
| Image Storage     | Cloudinary                                      |
| Charts            | Recharts                                        |
| Validation        | Zod                                             |
| Password Security | bcryptjs                                        |
| Deployment        | Vercel                                          |

---

## 🏗️ Application Architecture

The application is organized around the following functional modules:

1. **Customer Storefront** — Product discovery, shopping cart, checkout, and order management.
2. **Product Configuration** — Custom RO purifier configuration and component selection.
3. **Authentication** — Account registration, login, verification, and password recovery.
4. **Service Management** — AMC enquiries and RO maintenance requests.
5. **Payment Processing** — Razorpay checkout and Cash on Delivery.
6. **Administration** — Product management, order operations, and analytics.
7. **AI Assistance** — AquaBot support for product selection and troubleshooting.

The implementation should be verified against the actual project source code before treating every module as production-ready.

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root and configure the environment variables required by your application.

Use `.env.example` as the reference for the complete configuration.

```env
# Application
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="Shyam RO"
NEXT_PUBLIC_COMPANY_NAME="Shyam RO"

# MongoDB
MONGODB_URI=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Email Service
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false
MAIL_AUTH=
MAIL_PASS=
MAIL_FROM="Shyam RO <no-reply@shyamro.com>"

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AI Assistant
GROQ_API_KEY=
```

**Security guidelines:**

* Never commit `.env` files to GitHub.
* Never expose secret keys through `NEXT_PUBLIC_` variables.
* Use strong, randomly generated authentication secrets.
* Configure production credentials through Vercel Environment Variables.
* Use separate test and production payment credentials.
* Rotate any credentials accidentally committed to a repository.

Some variables may be optional depending on the features enabled in your deployment.


## 🚀 Getting Started

### Prerequisites

* Node.js 18.17.0 or a version compatible with your installed Next.js release.
* npm or Yarn.
* MongoDB local instance or MongoDB Atlas account.
* Git.

### 1. Clone the Repository

```bash
git clone https://github.com/adarshtiwaridev/shyam-ro-shopping.git
```

### 2. Navigate to the Project

```bash
cd shyam-ro-shopping
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create your local environment file.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux:**

```bash
cp .env.example .env
```

Add your actual configuration values to `.env`.

### 5. Start the Development Server

```bash
npm run dev
```

Open the application at:

http://localhost:3000

### 6. Create a Production Build

```bash
npm run build
```

### 7. Start the Production Server Locally

```bash
npm run start
```

Run the commands from the project root. Available scripts depend on the project's `package.json`.

---

## ☁️ Deploying to Vercel

Shyam RO Shopping can be deployed to Vercel.

### Deployment Steps

1. Push the project to GitHub.
2. Sign in to Vercel.
3. Import the `shyam-ro-shopping` repository.
4. Configure the required environment variables.
5. Confirm the framework preset and build settings.
6. Deploy the project.
7. Test authentication, product listings, checkout, emails, and administrative features.

### Production Environment Variables

Configure the required values under your Vercel project's environment settings.

Typical production configuration includes:

* `MONGODB_URI`
* `NEXTAUTH_URL`
* `NEXTAUTH_SECRET`
* `GOOGLE_CLIENT_ID`
* `GOOGLE_CLIENT_SECRET`
* `NEXT_PUBLIC_RAZORPAY_KEY_ID`
* `RAZORPAY_KEY_SECRET`
* Email service credentials.
* Cloudinary credentials.
* `GROQ_API_KEY`, if the AI assistant is enabled.
* `NEXT_PUBLIC_APP_URL`

Use the actual deployed domain for production URL variables. Update Google OAuth callback URLs, payment gateway settings, and any webhook endpoints to match the deployed application.

### Vercel Deployment URL

**Expected URL format:**

`https://shyam-ro-shopping.vercel.app`

This is a proposed deployment URL, not a verified live deployment. Vercel may assign a different URL depending on project configuration and domain availability.

After deployment, replace it with your actual production URL.

---

## 🔒 Security Best Practices

* Keep credentials and API secrets on the server.
* Validate incoming requests before processing them.
* Enforce authorization checks on protected API endpoints.
* Hash passwords before storing them.
* Use secure session and cookie settings.
* Validate payment status on the server rather than trusting the frontend.
* Verify payment webhooks using the appropriate signature verification mechanism.
* Restrict access to administrative functions.
* Avoid exposing customer information in logs or public pages.
* Keep private account, checkout, and administrative pages out of search engine indexes.
* Review dependencies and security advisories regularly.

---

## 📞 Support & Business Information

**Brand:** Shyam RO
**Repository:** `shyam-ro-shopping`
**Support Email:** [support@shyamro.com](mailto:support@shyamro.com)


> **Before publishing:** Verify the support email, both helpline numbers, and business address. Replace any placeholder or outdated details with the official business information.

---

## 🗺️ Future Improvements

Potential improvements for future releases include:

* Enhanced product recommendations.
* Advanced inventory and stock management.
* Improved order tracking.
* Automated AMC reminders.
* Expanded customer support workflows.
* Performance and accessibility improvements.
* Additional analytics and reporting.
* Automated testing and continuous integration.

---

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes with descriptive messages.
4. Push your branch to GitHub.
5. Open a pull request describing your changes.

Ensure that environment files and sensitive credentials are excluded from commits.

---

Some Pic and images of website 
---
<img width="1520" height="691" alt="image" src="https://github.com/user-attachments/assets/28214679-e8c2-4234-9b0f-75d2da9d6872" />
<img width="1518" height="688" alt="image" src="https://github.com/user-attachments/assets/6c7759aa-08ac-41ab-be6f-ce9299bf7ce2" />




## 📄 License

Specify the project's license before distributing or reusing the source code.

---

© 2026 Shyam RO. All rights reserved.
