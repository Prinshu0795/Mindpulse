# MindPulse 🧠✨
### Your Comprehensive Mental Well-being Companion

MindPulse is a sophisticated, AI-powered web platform designed to provide interactive support, stress tracking, and calming virtual experiences. Built with a "Calm UI" philosophy, it offers users a sanctuary to manage their mental health through cutting-edge technology and verified expert connections.

---

## 1. Project Overview
**Problem**: Mental health support is often inaccessible, expensive, or intimidating. Many people lack tools to track their stress levels or find immediate, soothing activities during anxious moments.

**Solution**: MindPulse bridges this gap by providing:
- Immediate **AI-driven emotional support** via chat and voice.
- **Gamified stress relief** to make mental wellness a daily habit.
- **Data-driven tracking** to help users visualize their emotional journey.
- **Direct connections** to verified human experts for professional care.

---

## 2. Key Features

### 💬 AI Virtual Connection
- **Empathetic Chatbot**: Powered by Groq (Llama 3.3), providing soothing and personalized responses.
- **Voice Interaction**: Integrated Web Speech API allows users to speak to the AI and hear responses.
- **Auto-Send**: Advanced voice logic that automatically submits messages once the user stops speaking.

### 🎮 Zen Quest (Gamified Wellness)
- **Mind Games**: Interactive tools like "Bubble Pop" for instant tactile stress relief.
- **Worry Box**: A digital space to "dump" anxious thoughts and clear the mind.
- **Virtual Garden**: A serene visual space for relaxation and grounding.

### 📊 Stress Dashboard
- **Visual Analytics**: Interactive charts using Recharts to track anxiety and stress levels over time.
- **Daily Check-ins**: Users can log their mood to see patterns in their well-being.

### 🌿 Wellness Hub
- **Guided Exercises**: Step-by-step guides for 4-7-8 Breathing and 5-4-3-2-1 Grounding.
- **Mindful Diet**: A curated guide on foods that promote calm vs. those that increase anxiety.

### 👨‍⚕️ Expert Connect
- **Verified Directory**: A list of top-rated psychologists and psychiatrists across India.
- **Direct Booking**: "Call-to-Book" system that reveals professional clinic details and contact numbers.

---

## 3. Technology Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | React.js | Core UI framework for component-based architecture. |
| **Styling** | Tailwind CSS v4 | Modern, utility-first styling with custom CSS variables. |
| **Backend** | Node.js / Express | Robust server-side logic and RESTful API endpoints. |
| **Database** | MongoDB | NoSQL database for flexible and scalable data storage. |
| **Auth** | JWT / Bcrypt / OAuth | Secure authentication with JSON Web Tokens and Google Login. |
| **Animations** | Framer Motion | Smooth transitions, micro-animations, and menu reveals. |
| **Icons** | Lucide React | Consistent, high-quality stroke icons across the platform. |
| **AI (Chat)** | Groq SDK | High-speed inference using Llama 3 models for the chatbot. |
| **Voice** | Web Speech API | Browser-native SpeechRecognition and SpeechSynthesis. |
| **Deployment** | Vercel / Render | Frontend and backend deployment with CI/CD. |

---

## 4. System Architecture

1.  **Frontend**: React components communicate with the backend via REST APIs.
2.  **Authentication**: Users can sign up with email/password or Google. Passwords are hashed with Bcrypt, and sessions are managed via JWT.
3.  **Backend Logic**: Express.js handles routing and controllers for auth, user profiles, and AI integrations.
4.  **Database**: MongoDB stores user information securely.
5.  **AI Engine**: Chat requests are proxied through the backend or handled client-side with appropriate API keys.
6.  **Voice Processing**: Native browser APIs handle STT and TTS.

---

## 5. Folder Structure

```text
/
├── backend/            # Express.js Server & MongoDB Models
│   ├── config/         # DB connection & Passport config
│   ├── controllers/    # API Refresh logic
│   ├── middleware/     # Auth & error handling
│   ├── models/         # Mongoose User schema
│   ├── routes/         # Backend API routes
│   └── server.js       # Main server entry
├── src/                # React Frontend
│   ├── assets/         # Images and static assets
│   ├── components/     # UI components (Navbar, AuthModal, etc.)
│   ├── context/        # Auth & Theme Context
│   └── App.jsx         # Frontend routing
```

---

## 6. Setup Instructions

To run MindPulse locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Prinshu0795/Mindpulse.git
    cd Mindpulse
    ```

2.  **Setup Backend**:
    - Navigate to `backend/` and run `npm install`.
    - Create a `.env` file in the `backend/` directory using `.env.example`.
    - Add your `MONGO_URI` (MongoDB connection string) and a `JWT_SECRET`.

3.  **Setup Frontend**:
    - Run `npm install` in the root directory.

4.  **Run Full-Stack**:
    ```bash
    npm run fullstack
    ```
    This will start both the frontend (Port 5173) and backend (Port 5000) simultaneously. Open [http://localhost:5173](http://localhost:5173) in your browser.
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 8. Deployment Process

### GitHub
The project is maintained on GitHub for version control. Every push to the `main` branch triggers an automatic build.

### Vercel Deployment
1.  Connect GitHub account to Vercel.
2.  Import the `MindPulse` repository.
3.  **Critical**: Configure Environment Variables in the Vercel Dashboard to match your local `.env`.
4.  The site is live at: [https://mindpulse-steel.vercel.app/](https://mindpulse-steel.vercel.app/)

---

## 9. Future Improvements
- **Mobile App**: Develop a React Native version for a native mobile experience.
- **AI Video Chat**: Full integration of live-talking AI avatars using the D-ID API.
- **Community Circles**: Secure, anonymous group chat rooms for peer support.
- **Wearable Integration**: Sync stress data with smartwatches (Apple Health / Google Fit).

---
*Developed with a focus on peace, privacy, and modern technology. 🌿*
