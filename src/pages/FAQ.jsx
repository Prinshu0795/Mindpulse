import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const faqs = [
    {
        question: "What is MindPulse?",
        answer: "MindPulse is a personal mental wellness tracking and self-care platform inspired by Wysa. It helps you log your daily moods, complete validated psychological screening assessments, reflect with an empathetic AI companion, and gain longitudinal insights into your mental health patterns over time."
    },
    {
        question: "Is MindPulse a medical diagnosis platform?",
        answer: "No. MindPulse provides wellness tracking, educational information, and screening tools. It is not a substitute for professional medical evaluation, diagnosis, or treatment. Always consult a healthcare professional for clinical advice or emergency assistance."
    },
    {
        question: "What is PSS-10?",
        answer: "The Perceived Stress Scale (PSS-10) is a classic stress assessment instrument. It measures the degree to which situations in your life are appraised as unpredictable, uncontrollable, and stressful over the recent month."
    },
    {
        question: "What is GAD-7?",
        answer: "The Generalized Anxiety Disorder Assessment (GAD-7) is a seven-item tool used to screen for and measure the severity of generalized anxiety symptoms in everyday life."
    },
    {
        question: "What is DASS-21?",
        answer: "The Depression, Anxiety, and Stress Scale (DASS-21) is a 21-item questionnaire designed to measure the severity of the core symptoms across depression, anxiety, and stress dimensions."
    },
    {
        question: "What is PHQ-9?",
        answer: "The Patient Health Questionnaire (PHQ-9) is a multipurpose instrument for screening, diagnosing, monitoring, and measuring the severity of depressive symptoms."
    },
    {
        question: "What is WHO-5?",
        answer: "The World Health Organization-Five Well-Being Index (WHO-5) is a short questionnaire consisting of 5 simple, non-invasive questions that measure subjective emotional well-being over the past two weeks."
    },
    {
        question: "How often should I complete an assessment?",
        answer: "For most users, taking a full assessment like the DASS-21 or PHQ-9 once every 2 to 4 weeks is sufficient to track long-term trends. You can use the daily check-in feature for day-to-day mood tracking."
    },
    {
        question: "How does the daily check-in work?",
        answer: "The daily check-in asks you to rate your mood, stress, anxiety, sleep quality, and note any key triggers from your day. Taking just 30 seconds daily helps the platform identify patterns between your habits and your mental state."
    },
    {
        question: "How does the AI wellness assistant work?",
        answer: "MindPulse AI is powered by Groq and empathetic conversational modeling in English and Hindi. It subtly references your recent check-ins and top stress triggers to provide grounded, compassionate reflections and calming coping exercises."
    },
    {
        question: "Is my personal data encrypted and private?",
        answer: "Yes. Your personal wellness information is strictly confidential. We employ industry-standard encryption and secure data handling to ensure your check-ins and assessment results remain private and are never sold to advertisers."
    },
    {
        question: "Can I delete my account?",
        answer: "Yes, you can request account deletion at any time by contacting our support team or navigating to your profile settings. Upon deletion, all your identifiable assessment and check-in data will be permanently removed."
    }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border border-border rounded-2xl bg-surface overflow-hidden mb-3.5 transition-all duration-200 hover:border-accent/40 shadow-sm">
            <button
                className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between font-bold text-text-primary focus:outline-none text-left"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className="pr-4 text-sm sm:text-base leading-snug">{question}</span>
                <ChevronDown 
                    size={20} 
                    className={`text-text-secondary transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-accent' : ''}`} 
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="px-5 sm:px-6 pb-5 pt-0 text-text-secondary text-xs sm:text-sm leading-relaxed border-t border-border/60 mt-1 pt-3.5">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQ = () => {
    const { t } = useTranslation();
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-28 pb-20 px-4 sm:px-6 relative transition-colors duration-300">
            <SEO 
                title="Mental Wellness FAQ | MindPulse"
                description="Find answers to common questions about MindPulse, wellness assessments, daily check-ins, privacy, AI insights and mental wellness tracking."
                canonical="/faq"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqs.map(f => ({
                        "@type": "Question",
                        "name": f.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": f.answer
                        }
                    }))
                }}
            />

            {/* Ambient glow */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-accent/10 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={14} />
                        <span>Common Questions</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        {t('faq.title1')} <span className="text-accent">{t('faq.title2')}</span>
                    </h1>
                    <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                        {t('faq.subtitle')}
                    </p>
                </div>

                <div>
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>

                <div className="bg-surface border border-border rounded-3xl p-8 sm:p-10 text-center shadow-sm">
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <HelpCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-2">{t('faq.stillHaveQuestions')}</h3>
                    <p className="text-text-secondary text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
                        {t('faq.stillDesc')}
                    </p>
                    <Link 
                        to="/contact" 
                        className="inline-block px-8 py-3.5 bg-accent text-white font-bold rounded-2xl hover:bg-accent/90 transition-all shadow-md shadow-accent/20 active:scale-[0.98] text-sm"
                    >
                        {t('faq.contactSupport')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
