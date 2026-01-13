# 📊 Analyzer  
*A competitive programming profile analyzer with AI-assisted insights.*

---

## 📌 Overview

**Analyzer** is a full-stack web application that aggregates user data from multiple competitive programming platforms —  
**LeetCode, Codeforces, AtCoder, and GeeksforGeeks** — and presents a unified performance view with **AI-powered analysis**.

The project focuses on solving real-world challenges such as:
- Normalizing data across platforms with different rating systems
- Reducing dependency on external APIs through caching
- Providing meaningful insights instead of raw statistics
- Maintaining conversational context using persistent chat history

---

## 🚀 Key Features

### 🏆 Multi-Platform Profile Aggregation
- Fetches user statistics from:
  - LeetCode
  - Codeforces
  - AtCoder
  - GeeksforGeeks
- Normalizes heterogeneous data into a consistent internal format
- Handles missing or partial platform data gracefully

---

### ⚡ Intelligent Caching Layer
- Uses **in-memory caching (Node-Cache)** to:
  - Reduce repeated external API calls
  - Improve response latency
- Cache invalidation strategy based on time-based expiry

---

### 🤖 AI-Powered Chat Analyzer
- Integrates **Google Generative AI (Gemini API)**
- Provides:
  - Performance summaries
  - Strength and weakness identification
- Maintains a **fixed-size sliding window** of recent messages for AI context
- Prevents unbounded token growth and latency issues
- Ensures responses remain relevant to the latest interactions

> The AI layer operates on **processed and normalized data**, not raw API responses.

---

### 🔐 Authentication & User Management
- JWT-based authentication
- Token support via headers or cookies
- Secure password hashing using **bcrypt**
- Protected routes for user-specific data

---

## 🧠 System Design Highlights

- **Backend-first trust model**  
  External data is validated and processed server-side before exposure.

- **Platform abstraction layer**  
  Each CP platform is handled independently, allowing easy extension.

- **Caching as a first-class component**  
  Designed to balance freshness vs performance.

- **AI as an analysis layer, not a data source**  
  Prevents hallucinations by constraining AI input.

---

## 🛠 Tech Stack

### Frontend
- React.js
- Framer Motion
- ReactMarkdown
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

### Authentication
- JWT
- bcrypt
- cookie-parser

### AI & Data
- Google Generative AI (Gemini API)
- Axios

### Caching
- Node-Cache (In-memory)

---

## ⚠️ Edge Cases Handled

- Missing or private user profiles
- API rate limits
- Partial platform availability
- Repeated requests for same user data
- Inconsistent platform metrics

---

## 🧪 Future Improvements

- Redis-based distributed caching
- Background jobs for scheduled data refresh
- Advanced skill-gap scoring models
- Platform-specific performance visualization

---

## 🧠 What I Learned

- Normalizing heterogeneous data sources
- Designing cache-aware backend systems
- Integrating AI safely into analytical workflows
- Managing conversational context in AI applications
- Balancing freshness, performance, and reliability

---

## 📄 Disclaimer

This project is built for **educational and demonstration purposes**.  
All platform data is fetched using publicly available endpoints and handled responsibly.

---

## 👨‍💻 Author

Built by **Piyush Sharma**  
Software Engineering Student | Full-Stack Developer

---

⭐ If you find this project useful or interesting, feel free to star the repository!
