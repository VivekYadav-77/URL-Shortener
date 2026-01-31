 <img src="./url-shortener-frontend/public/logo.svg"/> 

# Shortly (Secure URL Shortener)

A **secure, scalable URL shortener (Shortly)** built with **Node.js, Express, MongoDB, Redis, and React**, designed with **real-world security practices** such as abuse detection, URL risk analysis, caching, and admin moderation.

This project is not just about shortening URLs — it focuses on **security, performance, and correctness**.

---

## 🚀 Features

### 👤 User Features
- Shorten long URLs
- Optional custom alias
- Expiry control (default: 5 days, max: 7 days)
- URL history with metadata
- Click tracking
- Disable and Delete created url
- Automatic expiry handling

### 🛡️ Security Features
- URL risk analysis (phishing, suspicious patterns)
- Google Safe Browsing integration
- VirusTotal scanning
- Cached scan results (avoid re-scanning safe URLs)
- Abuse detection via IP-based rate limiting
- Redis-based request throttling
- Admin-enforced blocking (disabled/deleted URLs)

### 🧑‍💼 Admin Features
- View security logs
- Disable or delete malicious URLs 
- View high-risk URL attempts
- Manual moderation control

---

## 🧱 Tech Stack

### Backend
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Redis (Upstash)**
- **Zod** (request validation)
- **Helmet, HPP, Rate Limiting**
- **Cron Jobs**

### Frontend
- **React**
- **Redux Toolkit**
- **Tailwind CSS**
- **Vite**

---

## 📂 Project Structure

```text
URL-SHORTENER/
│
├── url-shortener-backend/            # Express.js Server Logic
│   ├── config/                       # Database & Service configs (e.g., redis)
│   ├── controllers/                  # API Logic (Auth, URL, Admin, Security)
│   ├── crons/                        # Scheduled Background Tasks
│   ├── jobs/                         # Worker processes or specific task logic
│   ├── middleware/                   # Security, Auth, and Rate Limiting
│   ├── models/                       # Mongoose Schemas (User, URL, Logs)
│   ├── public/                       # Static Assets & Error Pages
│   ├── routes/                       # API Route Definitions
│   ├── security/                     # Advanced Security Guards & Analyzers
│   ├── utils/                        # Shared Helpers (ApiError, tokens, etc.)
│   ├── app.js                        # App initialization
│   ├── index.js                      # Server Entry Point
│   └── tredish.js                    # Redis client initialization
│
├── url-shortener-frontend/           # React + Vite Frontend
│   ├── public/                       # Assets (logo.svg, Vivek.png)
│   ├── src/                          # Application Source Code
│   │   ├── App/                      # Core App wrappers
│   │   ├── components/               # Global reusable UI (Navbar, Inputs)
│   │   ├── Features/                 # Business logic modules
│   │   ├── Pages/                    # View Components (Dashboard, Profile)
│   │   ├── utils/                    # API clients and Formatters
│   │   ├── App.jsx                   # Root Component
│   │   ├── index.css                 # Global Styles
│   │   └── main.jsx                  # React Entry Point
│   ├── index.html                    # Main HTML Shell
│   ├── vercel.json                   # Deployment configuration
│   └── vite.config.js                # Vite build settings
│
├── .gitignore                        # Root git ignore
└── README.md                         # Main Project Documentation
```

---

## 🔁 URL Redirection Flow

1. User visits `/shortCode`
2. Server checks Redis cache
3. If cached → validate status
4. If not cached → fetch from DB
5. If **expired / disabled / deleted** → serve static HTML error page
6. If valid → redirect to original URL
7. Click & abuse stats updated in Redis
8. Cron job syncs Redis stats to MongoDB

---

## 🔐 URL Security Pipeline

```text
User Input URL
   ↓
Basic URL Validation
   ↓
Admin-flagged check
   ↓
Risk Score Analysis
   ↓
Recent Safe Scan? → Skip Scan
   ↓
Google Safe Browsing
   ↓
VirusTotal Scan
   ↓
Security Logs Stored
   ↓
URL Created
```

---

## 🧠 Smart Scan Optimization

- Safe URLs are **not re-scanned** within 2 weeks
- Security decisions stored in `SecurityLog` collection
- High-risk URLs are **blocked before scanning**
- Prevents API overuse & improves performance

---

## ⚡ Redis Usage

- URL caching (`url:{shortCode}`)
- Click & abuse stats (`stats:{shortCode}`)
- IP-based abuse tracking
- Rate limiting
- Temporary storage for performance

---

## 🕒 Cron Jobs

| Job         | Purpose                      |
| ----------- | ---------------------------- |
| Expiry Job  | Marks expired URLs           |
| Redis Flush | Syncs Redis stats to MongoDB |

---

## 🧪 Validation Rules

- Custom alias must be unique
- Expiry date must be within 7 days
- Empty alias/date handled safely
- Zod schema ensures clean input

---

## 📸 Screenshots

### 🧑‍💼 Admin Dashboard


<picture>
    <source media="(prefers-color-scheme: dark)" srcset="./Adminfaceimages/Screenshot%202026-01-31%20105503.png">
    <img alt="Admin Dashboard" src="./Adminfaceimages/Screenshot%202026-01-31%20111529.png">
  </picture>



### 🧑‍💼 User Dashboard

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="./Adminfaceimages/Screenshot%202026-01-31%20111837.png">
    <img alt="Admin Dashboard" src="./Adminfaceimages/Screenshot%202026-01-31%20111813.png">
  </picture>

---

## ⚙️ Environment Variables

Create a `.env` file for backend :

```env
PORT=5000
MONGO_URL=your_mongodb_uri
REDIS_URL=your_upstash_url
REDIS_TOKEN=your_upstash_token
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=your access secret
JWT_REFRESH_SECRET=your refresh secret
VIRUS_TOTAL_API_KEY=your_key
GOOGLE_SAFE_BROWSING_KEY=your_key
EMAIL_USER=your comapny email 
GOOGLE_SCRIPT_URL=your own script url with comany domain email
```

---
Create a `.env` file for frontend :

```env
VITE_EMAIL = your company email 
VITE_B_LOCATION= your backend address or http://localhost:5000
```
## ▶️ Run Locally

```bash
# Backend
npm install
node index.js
# Frontend
npm install
npm run dev
```

---

## 🎯 Why This Project Matters

This project demonstrates:

- Backend system design
- Security-first thinking
- Real-world Redis usage
- Abuse prevention strategies
- Clean architecture & separation of concerns

It is built like a **production system**, not a tutorial demo.

---



## 👤 Author

**Vivek**  
Backend & Full-Stack Developer  
Focused on **security, performance, and real-world systems**

---


