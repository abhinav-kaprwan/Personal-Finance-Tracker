# 💰 Personal Finance Tracker

A robust full-stack application designed to help users manage their financial health. This application allows users to securely track income and expenses, visualize financial data through dynamic charts, and manage transactions with a high-performance backend.

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)

</div>

---

## 🚀 Live Demo

Check out the live application deployed on Vercel and Render:

- **Frontend:** [https://YOUR_FRONTEND_URL.vercel.app](https://YOUR_FRONTEND_URL.vercel.app)
- **Backend API:** [https://YOUR_BACKEND_URL.onrender.com](https://YOUR_BACKEND_URL.onrender.com)

---

## 🛠 Tech Stack

### Frontend
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **HTTP Client:** Axios
* **Visualization:** Recharts (Pie & Line Charts)
* **Routing:** React Router

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Neon Cloud DB)
* **Authentication:** JWT (JSON Web Tokens)
* **Caching:** Redis (Upstash)

### Deployment
* **Frontend:** Vercel
* **Backend:** Render
* **Database:** Neon PostgreSQL
* **Cache:** Upstash Redis

---

## ✨ Features

### 🔐 Authentication & Authorization
* User registration and secure login.
* **JWT-based authentication** for stateless session management.
* **Role-Based Access Control (RBAC):** Distinct roles for standard users and admins.
* Protected API routes to prevent unauthorized access.

### 💸 Transaction Management
* Add, view, and delete income & expense transactions.
* Categorize transactions for better organization.
* **Pagination:** Efficiently load large lists of transactions.
* *Admin Feature:* Admins can view transactions across all users.

### 📊 Analytics Dashboard
* Visual breakdown of total income, expenses, and current balance.
* **Pie Chart:** Category-wise expense distribution.
* **Line Chart:** Monthly income vs. expense trends.
* **Performance:** Analytics data is cached via Redis to reduce database load.

### ⚡ Performance & Security
* **Redis Caching:** Implemented for analytics endpoints.
* **Cache Invalidation:** Automatic updates when transactions are modified.
* **Security:** Secure CORS configuration and environment-based settings.

---

## 📂 Project Structure

```bash
personal_finance_tracker/
│
├── backend/
│   ├── src/
│   │   ├── controllers/   # Route logic
│   │   ├── routes/        # API definitions
│   │   ├── middleware/    # Auth & Error handling
│   │   ├── config/        # DB & Redis config
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # Dashboard, Login, etc.
│   │   ├── components/    # Reusable UI components
│   │   ├── api/           # Axios setup
│   │   └── contexts/      # Global state (Auth)
│   └── package.json
