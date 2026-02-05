# EventEase Lite - Project Requirements

This document outlines the system requirements and software dependencies necessary to run the EventEase Lite project.

## 💻 System Requirements

- **Node.js**: version 16.0.0 or higher
- **Package Manager**: npm (v8+) or yarn
- **Database**: MongoDB (Local instance or MongoDB Atlas)
- **Environment**: Windows, macOS, or Linux

---

## 🚀 Frontend Requirements (Client)

The frontend is built with **React** and **Vite**.

### Core Dependencies
- **React**: ^18.2.0
- **React DOM**: ^18.2.0
- **React Router DOM**: ^6.8.1 (Routing)
- **Axios**: ^1.3.4 (API Client)
- **recharts**: ^3.1.0 (Charts for Analytics)
- **qrcode.react**: ^4.2.0 (Payment QR Generation)

### Development Tools
- **Vite**: ^4.1.0 (Build tool)
- **Tailwind CSS**: ^3.2.7 (Styling framework)
- **ESLint**: ^8.36.0 (Linting)
- **PostCSS** & **Autoprefixer**: For CSS processing

---

## 🛠️ Backend Requirements (Server)

The backend is built with **Node.js** and **Express**.

### Core Dependencies
- **Express**: ^4.18.2 (Web framework)
- **Mongoose**: ^7.5.0 (MongoDB ODM)
- **JSONWebToken (JWT)**: ^9.0.2 (Authentication)
- **bcryptjs**: ^2.4.3 (Password hashing)
- **CORS**: ^2.8.5 (Cross-Origin Resource Sharing)
- **dotenv**: ^16.3.1 (Environment variable management)

### Development Tools
- **Nodemon**: ^3.0.1 (Auto-reloading during development)

---

## ⚙️ Configuration Requirements

### Mandatory Environment Variables (`server/.env`)
- `PORT`: Port number (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing

### Development Setup
- `VITE_API_URL` (in `client/.env` - optional/defaulting to localhost:5000)
