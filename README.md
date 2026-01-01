💰 Personal Finance Tracker – Full Stack Application

A full-stack personal finance management application that allows users to track income and expenses, visualize financial data, and manage transactions securely.

🚀 Live Demo

Frontend: https://YOUR_FRONTEND_URL.vercel.app

Backend API: https://YOUR_BACKEND_URL.onrender.com

🛠 Tech Stack
Frontend

React (Vite)

Tailwind CSS

Axios

Recharts (Pie & Line Charts)

React Router

Backend

Node.js

Express.js

PostgreSQL (Neon Cloud DB)

JWT Authentication

Redis (Upstash – used for analytics caching)

Deployment

Frontend: Vercel

Backend: Render

Database: Neon PostgreSQL

Cache: Upstash Redis

✨ Features Implemented
🔐 Authentication & Authorization

User registration & login

JWT-based authentication

Role-based access (user, admin)

Protected API routes

💸 Transactions

Add income & expense transactions

Categorize transactions

Paginated transaction list

Role-based access (admin can see all users)

📊 Analytics Dashboard

Total income, expense & balance

Category-wise expense breakdown (Pie Chart)

Monthly income vs expense trend (Line Chart)

Cached analytics for performance (Redis)

📁 Categories

Predefined income & expense categories

Used while adding transactions

⚡ Performance & Production Readiness

Redis caching for analytics endpoints

Cache invalidation on transaction changes

Secure CORS configuration

Environment-based configuration

Production-ready API

📂 Project Structure
personal_finance_tracker/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── contexts/
│   └── package.json

🔧 Environment Variables
Backend (.env)
PORT=5000
DATABASE_URL=your_neon_db_url
JWT_SECRET=your_secret_key
NODE_ENV=production

Frontend (.env)
VITE_API_URL=https://YOUR_BACKEND_URL.onrender.com/api

▶️ How to Run Locally
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

🧠 Key Learnings / Highlights

Implemented secure JWT authentication

Designed RESTful APIs

Handled production CORS issues

Integrated cloud PostgreSQL (Neon)

Used Redis caching safely in production

Built responsive UI with Tailwind CSS

Deployed full stack app successfully
