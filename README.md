# Secure Bank Backend API

A production-ready RESTful banking backend built with **Node.js**, **Express**, and **MongoDB**. It handles end-to-end financial workflows with high security and data integrity.

🚀 **Live Demo:** [https://bank-project-a1e3.onrender.com](https://bank-project-a1e3.onrender.com)

---

## 📌 Key Features

* **Secure Auth:** Registration & login with `bcrypt` password hashing and JWT stored in HTTP-Only cookies.
* **Token Blacklisting:** Built-in logout mechanism that revokes JWTs to prevent replay attacks.
* **Double-Entry Ledger:** Every transaction logs explicit debit/credit entries to guarantee financial consistency.
* **Data Integrity:** Senders' balances are dynamically derived from ledger history via MongoDB Aggregation Pipelines.
* **Idempotency Guards:** Prevents duplicate transactions caused by network retries.
* **Automated Emails:** Instant registration and transaction alerts sent via **Nodemailer**.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Security:** JWT, Bcrypt, HTTP-Only Cookies
* **Mailing:** Nodemailer

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone [https://github.com/your-username/bank-backend-project.git](https://github.com/your-username/bank-backend-project.git)
cd bank-backend-project
npm install
2. Configure Environment (.env)
Code snippet
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
3. Run
Development: npm run dev

Production: npm start

🔌 Core Endpoints
🔐 Authentication
POST /api/auth/register - Create user & send welcome email

POST /api/auth/login - Authenticate & issue cookie token

POST /api/auth/logout - Revoke token & clear session

💼 Accounts & Transactions
POST /api/accounts - Initialize bank account
POST /api/accounts - Initialize bank account

GET /api/accounts/balance - Fetch derived balance via aggregation

POST /api/transactions - Transfer funds (Checks idempotency, logs ledger, sends email)

GET /api/accounts/balance - Fetch derived balance via aggregation

POST /api/transactions - Transfer funds (Checks idempotency, logs ledger, sends email)
