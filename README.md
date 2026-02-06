# MindPulse 🧠✨

MindPulse is a comprehensive mental well-being platform designed to provide interactive support, stress tracking, and calming activities.

## 🚀 Features
- **Mind Games**: Interactive tools like Bubble Pop and 5-4-3-2-1 Sensory grounding.
- **Wellness Hub**: Guided breathing exercises and stress-relief diet tips.
- **Stress Dashboard**: Track your anxiety and stress levels with visual charts.
- **AI Chat**: Personalized support via Groq-powered AI.
- **AI Video Presence**: Animate photos into supportive digital beings (Coming Soon).
- **Expert Connect**: Find and call verified mental health professionals across India.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts

---

## 🔒 Security: API Keys
This project uses several APIs (Groq, D-ID, etc.). To keep these keys secure:
1. All keys are stored in a `.env` file (which is ignored by Git).
2. The `.gitignore` file includes `.env` to prevent accidental uploads.
3. Live deployments must have these keys set as "Environment Variables" in the hosting dashboard (Vercel/Netlify).

---

## 🚢 Deployment Steps

### Step 1: Initialize Git Repository
If you haven't already initialized a repository:
```bash
git init
git add .
git commit -m "Initial commit: MindPulse Wellness Platform"
```

### Step 2: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `MindPulse`).
3. Click **Create repository**.

### Step 3: Connect and Push
Copy the commands from GitHub and run them in your terminal:
```bash
git remote add origin https://github.com/YOUR_USERNAME/MindPulse.git
git branch -M main
git push -u origin main
```

### Step 4: Hosting (Recommended: Vercel)
The easiest way to host a Vite app is **Vercel**:
1. Go to [vercel.com](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.
4. **IMPORTANT**: Click on **Environment Variables** and add all the keys from your `.env` file:
   - `VITE_GROQ_API_KEY`
   - `VITE_DID_API_KEY`
   - `VITE_GEMINI_API_KEY`
5. Click **Deploy**.

---
*Created with care for mental well-being.* 🌿
