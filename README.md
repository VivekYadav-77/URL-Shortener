<img src="./url-shortener-frontend/public/logo.svg" width="60" />

# Shortly — Secure & Fault-Tolerant URL Shortener

A **production-inspired URL shortener** built with **Node.js, Express, MongoDB, Redis, and React**, focused on **security, performance, and fault-tolerant backend design**.

Unlike typical URL shorteners, this system is designed to **continue functioning even if Redis (cache layer) is unavailable**, ensuring reliability under real-world failure conditions.

---

# 🧠 Core Engineering Principles

* **Fault Tolerance First** → System works even if Redis fails
* **MongoDB as Source of Truth** → No dependency on cache correctness
* **Non-blocking Request Flow** → Fast redirects, async updates
* **Security + Performance Balance** → Avoid over-engineering

---

# 🏗️ System Architecture

```text
Client
  ↓
Express API (Render)
  ↓
Redis (optional cache)
  ↓
MongoDB (primary database)
```

---

# 🚀 Features

## 👤 User Features

* Shorten long URLs
* Optional custom alias (unique enforced)
* Expiry control (default: 5 days, max: 7 days)
* URL history with metadata
* Click tracking
* Disable & delete URLs
* Automatic expiry handling

---

## 🛡️ Security Features

* URL risk analysis (phishing & suspicious pattern detection)
* Google Safe Browsing integration
* VirusTotal scanning
* Cached scan results (avoid re-scanning safe URLs)
* IP-based rate limiting (Redis-backed, fault-tolerant)
* Admin-enforced blocking (disabled/deleted URLs)

---

## 🧑‍💼 Admin Features

* View security logs
* Detect high-risk URL attempts
* Disable or delete malicious URLs
* Manual moderation controls

---

# 🔁 Redirect Flow (Optimized & Reliable)

```text
1. User hits /:shortCode
2. Try Redis cache
   → If hit → validate → redirect
3. Cache miss → query MongoDB
4. Validate (active / not expired / not deleted)
5. Redirect immediately
6. Cache result (non-blocking)
7. Increment clicks asynchronously
```

---

# 💥 Failure Handling (Real-World Thinking)

### Redis Failure

* System falls back to MongoDB
* No broken redirects
* Only performance degradation

### High Traffic

* Rate limiter prevents abuse
* Cache reduces database load

### Expired / Invalid URLs

* Returns static error page (410 Gone)

---

# 🔐 URL Security Pipeline

```text
User Input URL
   ↓
Validation (Zod)
   ↓
Admin Flag Check
   ↓
Risk Score Analysis
   ↓
Recent Safe Scan? → Skip
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

# 🧠 Smart Scan Optimization

* Safe URLs are **not re-scanned within 2 weeks**
* Security logs stored in `SecurityLog` collection
* High-risk URLs blocked early
* Reduces API cost and improves performance

---

# ⚡ Redis Usage (Optimized)

* URL caching → `url:{shortCode}`
* Rate limiting → `rl:{ip}`
* Minimal Redis operations per request
* Redis treated as **non-critical dependency**

---

# 🧱 Tech Stack

## Backend

* Node.js + Express
* MongoDB (Mongoose)
* Redis (Upstash)
* Zod (validation)
* Helmet, HPP

## Frontend

* React + Vite
* Redux Toolkit
* Tailwind CSS

---

# 📊 Performance Considerations

* Indexed lookup on `shortCode`
* Lean queries (`.lean()`)
* Reduced Redis calls per request
* Async DB updates for clicks
* Cache TTL optimization (24h)

---

# 🕒 Background Jobs

| Job                   | Purpose                  |
| --------------------- | ------------------------ |
| Expiry Job            | Marks expired URLs       |
| (Optional) Redis Sync | Can sync stats if needed |

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


# 🧪 Validation Rules

* Custom alias must be unique
* Expiry limited to 7 days
* Safe handling of empty fields
* Strict schema validation using Zod

---

# 📸 Screenshots

### 🧑‍💼 Admin Dashboard

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./Adminfaceimages/Screenshot%202026-01-31%20105503.png">
  <img alt="Admin Dashboard" src="./Adminfaceimages/Screenshot%202026-01-31%20111529.png">
</picture>

---

### 👤 User Dashboard

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./Adminfaceimages/Screenshot%202026-01-31%20111837.png">
  <img alt="User Dashboard" src="./Adminfaceimages/Screenshot%202026-01-31%20111813.png">
</picture>

---

# ⚙️ Environment Variables

## Backend

```env
PORT=5000
MONGO_URL=your_mongodb_uri
REDIS_URL=your_upstash_url
REDIS_TOKEN=your_upstash_token
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
VIRUS_TOTAL_API_KEY=your_key
GOOGLE_SAFE_BROWSING_KEY=your_key
```

## Frontend

```env
VITE_B_LOCATION=http://localhost:5000
```

---

# ▶️ Run Locally

```bash
# Backend
npm install
node index.js

# Frontend
npm install
npm run dev
```

---

# 🎯 Why This Project Stands Out

This project demonstrates:

* Fault-tolerant backend design
* Real-world caching strategy (Redis as optional)
* Security-first URL handling
* Clean architecture & separation of concerns
* Practical trade-offs instead of overengineering

---

# 👤 Author

**Vivek**
Focused on building **reliable, scalable, real-world systems**

---

