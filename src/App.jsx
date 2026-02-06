import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider as UIThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ChatSection from './components/ChatSection';
import VideoGenSection from './components/VideoGenSection';
import StressDashboard from './components/StressDashboard';
import ZenQuest from './components/ZenQuest';
import WellnessHub from './components/WellnessHub';
import ExpertsSection from './components/ExpertsSection';
import AIVideoTools from './components/AIVideoTools';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import AuthModal from './components/AuthModal';
import CustomerService from './components/CustomerService';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[200] bg-sand dark:bg-[#0f172a] flex items-center justify-center p-6"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="w-24 h-24 bg-sky rounded-[2rem] flex items-center justify-center text-white mx-auto mb-8 shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Heart size={48} fill="currentColor" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-black text-slate dark:text-sage mb-4"
        >
          MindPulse
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-slate-500 dark:text-sage/60 font-medium"
        >
          Welcome to your peaceful space.
        </motion.p>
      </div>
    </motion.div>
  );
};

const Hero = () => (
  <header className="relative py-32 overflow-hidden">
    <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-sky/30 blur-[100px] rounded-full" />
    <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-sage/30 blur-[100px] rounded-full" />

    <div className="max-w-6xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <h1 className="text-6xl md:text-8xl font-black text-slate dark:text-sage mb-6 tracking-tight leading-none">
          Breathe in <br /><span className="text-sky-600">Peace.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-sage/60 max-w-2xl mx-auto mb-10">
          Connecting your mind to meaningful virtual experiences and professional support.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 bg-white/50 dark:bg-navy/30 backdrop-blur-md border border-sage/20 px-6 py-3 rounded-2xl text-sm font-bold text-slate-600 dark:text-sage/60"
        >
          <Sparkles size={16} className="text-sky-500" />
          Your Journey Starts Here
        </motion.div>
      </motion.div>
    </div>
  </header>
);

const AppContent = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="min-h-screen selection:bg-sky/30">
      <AnimatePresence>
        {!isLoaded && <SplashScreen onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar />
          <Hero />
          <main className="space-y-24">
            <div id="connect"><ChatSection /></div>
            <div id="presence"><VideoGenSection /></div>
            <div id="dashboard"><StressDashboard /></div>
            <div id="quest"><ZenQuest /></div>
            <div id="wellness"><WellnessHub /></div>
            <AIVideoTools />
            <div id="experts"><ExpertsSection /></div>
          </main>
          <Footer />
          <ThemeToggle />
          <CustomerService />
          <AuthModal />
        </motion.div>
      )}
    </div>
  );
};

function App() {
  return (
    <UIThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </UIThemeProvider>
  );
}

export default App;
