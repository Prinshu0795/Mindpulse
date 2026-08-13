import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const faqs = [
    {
        question: "What is MindPulse?",
        answer: "MindPulse is a personal mental wellness tracking and self-care platform. It helps you log your daily moods, complete validated psychological screening assessments, and gain insights into your mental health patterns over time."
    },
    {
        question: "Is MindPulse a medical diagnosis platform?",
        answer: "No. MindPulse provides wellness tracking, educational information, and screening tools. It is not a substitute for professional medical evaluation, diagnosis, or treatment. Always consult a healthcare professional for medical advice."
    },
    {
        question: "What is PSS-10?",
        answer: "The Perceived Stress Scale (PSS-10) is a classic stress assessment instrument. It measures the degree to which situations in your life are appraised as stressful over the recent period."
    },
    {
        question: "What is GAD-7?",
        answer: "The Generalized Anxiety Disorder Assessment (GAD-7) is a seven-item tool used to screen for and measure the severity of generalized anxiety symptoms."
    },
    {
        question: "What is DASS-21?",
        answer: "The Depression, Anxiety, and Stress Scale (DASS-21) is a 21-item questionnaire designed to measure the severity of the core symptoms of depression, anxiety, and stress."
    },
    {
        question: "What is PHQ-9?",
        answer: "The Patient Health Questionnaire (PHQ-9) is a multipurpose instrument for screening, diagnosing, monitoring, and measuring the severity of depression."
    },
    {
        question: "What is WHO-5?",
        answer: "The World Health Organization-Five Well-Being Index (WHO-5) is a short questionnaire consisting of 5 simple and non-invasive questions, which tap into the subjective well-being of the respondent."
    },
    {
        question: "How often should I complete an assessment?",
        answer: "For most users, taking a full assessment like the DASS-21 or PHQ-9 once every 2 to 4 weeks is sufficient to track long-term trends. You can use the daily check-in feature for day-to-day mood tracking."
    },
    {
        question: "How does the daily check-in work?",
        answer: "The daily check-in asks you to rate your mood, sleep quality, and note any key triggers or events from the day. Taking just 30 seconds daily helps the platform identify patterns between your habits and your mental state."
    },
    {
        question: "How does the AI wellness assistant work?",
        answer: "The AI wellness assistant analyzes your anonymized recent check-ins and assessment scores to provide personalized, supportive insights. It can suggest coping strategies and highlight potential triggers based on your data."
    },
    {
        question: "Is my information private?",
        answer: "Yes. Your personal wellness information is treated with high security standards. We employ encryption and secure data handling to ensure your check-ins and assessment results remain private."
    },
    {
        question: "Can I delete my account?",
        answer: "Yes, you can request account deletion at any time by contacting our support team or navigating to your profile settings. Upon deletion, all your identifiable assessment and check-in data will be permanently removed."
    }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border border-border rounded-xl bg-surface overflow-hidden mb-4 transition-colors hover:border-accent/30">
            <button
                className="w-full px-6 py-4 flex items-center justify-between font-bold text-text-primary focus:outline-none"
                onClick={onClick}
            >
                <span className="text-left pr-4">{question}</span>
                <ChevronDown 
                    size={20} 
                    className={`text-text-secondary transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-accent' : ''}`} 
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-5 pt-0 text-text-secondary leading-relaxed border-t border-border mt-2 pt-4">
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
        <div className="min-h-screen bg-bg text-text-primary pt-24 pb-20 px-4">
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
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        {t('faq.title1')} <span className="text-accent">{t('faq.title2')}</span>
                    </h1>
                    <p className="text-text-secondary text-lg">
                        {t('faq.subtitle')}
                    </p>
                </div>

                <div className="mb-12">
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

                <div className="bg-accent/10 border border-accent/20 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-bold text-text-primary mb-4">{t('faq.stillHaveQuestions')}</h3>
                    <p className="text-text-secondary mb-6">
                        {t('faq.stillDesc')}
                    </p>
                    <Link to="/contact" className="inline-block px-8 py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-colors">
                        {t('faq.contactSupport')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
