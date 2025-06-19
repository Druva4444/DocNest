# 📦 DocNest – Scalable Cloud Document Storage with Subscriptions & Google OAuth

**DocNest** is a fully-featured, production-ready cloud storage platform tailored for document upload, access, and subscription-based usage. Built with a modern full-stack architecture, it supports secure Google OAuth login, AWS S3-backed file storage, and flexible Stripe billing for monthly plans.

---

## 🚀 Features

- 🔐 **Google OAuth Authentication** – Secure and convenient user login via Google.
- 📁 **Document Upload & Management** – Users can upload, view, and manage personal files in a secure, cloud-hosted dashboard.
- ☁️ **AWS S3 Integration** – Durable, scalable, and reliable cloud file storage.
- 💳 **Stripe Billing System** – Seamlessly manage user subscriptions with monthly plan tiers.
- 📦 **Usage-Based Plan Enforcement** – Restrict or grant access based on the user’s active subscription plan.
- 🧱 **Clean Modular Architecture** – Built with clean code principles to support maintainability and scalability.

---

## 🛠 Tech Stack

### 🔷 Frontend
- **React.js** – SPA for dynamic user experience
- **Tailwind CSS**  – Modern utility-first CSS styling
- **Axios** – HTTP client for API calls

### 🔶 Backend
- **Node.js + Express.js** – RESTful API server with business logic
- **MongoDB** – NoSQL database to manage users, files, and plans
- **AWS S3** – Cloud storage for documents
- **Stripe SDK** – Handles subscriptions and billing
- **Passport.js + Google OAuth2.0** – Authentication middleware

---

## 📁 Project Structure

- /client → React frontend (dashboard, file uploads)
- /server → Node backend (APIs, OAuth, Stripe, S3)
- /server/models → Mongoose schemas
- /server/controllers →  business functions
- /server/utils → Helpers (S3 upload, token handling, etc.)
- /server/routes → Route paths 
- /server/midddleware → Mddleware to check authentication 




## ENV File

setup a .env file in backend root directory
- MONGO_URL=
- PORT=
- CLOUDINARY_NAME=
- CLOUDINARY_API_KEY=
- CLOUDINARY_API_SECRET=
- AWS_ACCESS=
- AWS_SECRET=
- AWS_BUCKET=
- JWT_SECRET=
- GOOGLE_CLIENT_ID=
- STRIPE_SECRET_KEY=
- FRONTEND_URL=
- STRIPE_WEBHOOK_SECRET=



## Run Locally
## Backend

- cd server
- npm install
- npm run dev

## Frontend

- cd client
- npm install
- npm run dev
