# 🤖 AI Resume Tracker

An AI-powered resume analysis and tracking platform that helps job seekers understand their resume quality, improve ATS compatibility, identify missing keywords, and manage multiple resume versions.

## 🚀 Features

* 🔐 User Registration & Login
* 📄 Resume PDF Upload
* 🤖 AI-powered Resume Analysis using Google Gemini
* 📊 ATS Score (0–100)
* 💡 Resume Improvement Suggestions
* ✍️ AI-generated Resume Bullet Improvements
* 🔑 Present & Missing Keyword Detection
* 📈 Resume Score Insights
* 📝 Multiple Resume Versions
* 🔄 Resume Version Comparison
* 💼 Job Application Tracking
* 📋 Activity History
* 📊 Dashboard with Resume & Application Statistics
* 🔒 JWT Authentication with secure HTTP-only cookies

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* JavaScript
* Recharts
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer

### AI & Resume Processing

* Google Gemini API
* PDF parsing
* Zod structured validation

## 🏗️ Project Structure

```text
ai-resume-tracker/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── package.json
│
└── .gitignore
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sharmila521/ai-resume-tracker.git
cd ai-resume-tracker
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` folder.

Add the required environment variables for:

* MongoDB connection
* JWT authentication
* Google Gemini API
* Other backend configuration

**Never commit your `.env` file to GitHub.**

### 5. Start the backend

```bash
cd server
npm run dev
```

### 6. Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

The application can then be accessed through the local development URL shown by Vite.

## 🎯 Project Goal

The goal of AI Resume Tracker is to provide job seekers with an easy-to-use platform for analyzing resumes, improving resume quality, tracking applications, and maintaining different resume versions throughout the job search process.

## 👩‍💻 Author

**Sharmila**

Computer Science Engineering Student

Interested in Full Stack Development and AI

GitHub: [@sharmila521](https://github.com/sharmila521)
