📊 Analyzer App
Analyzer is a full-stack web application that aggregates and analyzes user data from various competitive programming platforms (LeetCode, Codeforces, AtCoder, GeeksforGeeks) and provides AI-powered chat capabilities for personalized insights.

🚀 Features
Competitive Programming Profile Fetching
Pulls user data from LeetCode, Codeforces, AtCoder, and GeeksforGeeks APIs.
Caches responses for faster access and reduced API calls.
AI Chat Assistant (Google Gemini)
Context-aware conversations using saved chat history.

Authentication & User Management
JWT-based authentication with cookie or header token support.
Secure password hashing with bcrypt.
Persistent Chat History

🛠 Tech Stack
Backend: Node.js, Express.js, React
Database: MongoDB (Mongoose ODM)
Authentication: JWT + Cookies
AI Integration: Google Generative AI (Gemini API)
Caching: In-memory cache for external API data, Node-Cache
Other: Axios, bcrypt, dotenv, cors, cookie-parser, ReactMarkdown, Framer-Motion
