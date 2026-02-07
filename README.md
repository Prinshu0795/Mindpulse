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
| **Animations** | Framer Motion | Smooth transitions, micro-animations, and menu reveals. |
| **Icons** | Lucide React | Consistent, high-quality stroke icons across the platform. |
| **AI (Chat)** | Groq SDK | High-speed inference using Llama 3 models for the chatbot. |
| **Voice** | Web Speech API | Browser-native SpeechRecognition and SpeechSynthesis. |
| **Visuals** | Recharts | Data visualization for the user's stress dashboard. |
| **Deployment** | Vercel | Production hosting with automatic CI/CD from GitHub. |

---

## 4. System Architecture

1.  **User Input**: User interacts via Text (Input Field) or Voice (Microphone).
2.  **Voice Processing**: If voice is used, the `Web Speech API` converts audio to text.
3.  **AI Engine**: The text is sent to the `Groq API` along with a system prompt ensuring a compassionate, therapeutic persona.
4.  **Response Generation**: The AI generates a text response, which is then:
    - Displayed in the chat UI.
    - Converted back to audio using `SpeechSynthesis` for a complete "Virtual Presence" experience.
5.  **State Management**: User preferences, theme choices, and stress logs are persisted using `React Context` and `LocalStorage`.

---

## 5. API Integrations

-   **Groq API**: Handles the natural language processing (NLP) for the companion. Uses the `llama-3.3-70b-versatile` model.
-   **D-ID API**: (Integrated/Maintenance) Used for generating high-quality AI video avatars from static photos.
-   **Web Speech API**: Native browser API used for real-time speech-to-text and text-to-speech without external costs.

---

## 6. Folder Structure

```text
src/
├── assets/             # Images and static assets
├── components/         # Reusable UI components (Navbar, Sections, Modals)
│   ├── ChatSection.jsx # AI Chat & Voice logic
│   ├── ZenQuest.jsx    # Gamified activities
│   └── ExpertsSection.jsx # Expert directory & booking
├── context/            # Global state (Auth, Theme)
├── utils/              # Helper functions (Image cropping, etc.)
├── App.jsx             # Main layout and routing
└── index.css           # Global styles and Tailind 4 configuration
```

---

## 7. Setup Instructions

To run MindPulse locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Prinshu0795/Mindpulse.git
    cd Mindpulse
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root directory and add your keys:
    ```env
    VITE_GROQ_API_KEY=your_groq_key_here
    VITE_DID_API_KEY=your_did_key_here
    ```

4.  **Start Development Server**:
    ```bash
    npm run dev
    ```
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
