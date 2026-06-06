import React from 'react';
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
import AuthModal from './components/AuthModal';
import CustomerService from './components/CustomerService';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Hero = () => (
  <header className="pt-32 pb-24 md:pt-40 md:pb-32 px-4 md:px-6 max-w-6xl mx-auto text-center">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-bold tracking-tight mb-6 text-text-primary">
        Breathe in <br /><span className="text-accent">Peace.</span>
      </h1>
      <p className="text-text-secondary max-w-2xl mx-auto mb-10">
        Connecting your mind to meaningful virtual experiences and professional support.
      </p>
      <button
        className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-xl font-medium transition-colors hover:bg-accent/90"
      >
        <Sparkles size={18} />
        Your Journey Starts Here
      </button>
    </motion.div>
  </header>
);

const AppContent = () => {
  return (
    <div className="min-h-screen bg-bg text-text-primary transition-colors duration-300">
      <Navbar />
      <Hero />
      <main className="space-y-24 pb-24">
        <div id="connect"><ChatSection /></div>
        <div id="presence"><VideoGenSection /></div>
        <div id="dashboard"><StressDashboard /></div>
        <div id="quest"><ZenQuest /></div>
        <div id="wellness"><WellnessHub /></div>
        <AIVideoTools />
        <div id="experts"><ExpertsSection /></div>
      </main>
      <Footer />
      <CustomerService />
      <AuthModal />
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
