import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Clock, HelpCircle, Activity, ChevronRight, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

import DASS21 from '../components/assessments/DASS21';
import PHQ9 from '../components/assessments/PHQ9';
import WHO5 from '../components/assessments/WHO5';
// Note: PSS-10 and GAD-7 are legacy inline modals inside Dashboard, but we should handle them or redirect to dashboard to take them.
// For now, we will redirect to /dashboard to take assessments to keep the logic centralized.
import { useNavigate } from 'react-router-dom';
import assessmentBgImage from '../assets/Assment.jpg';

const assessments = [
    {
        id: 'PSS-10',
        name: 'PSS-10',
        measures: 'Perceived Stress',
        questions: 10,
        time: '3-5 min',
        description: 'Measures the degree to which situations in one\'s life are appraised as stressful over the recent period.'
    },
    {
        id: 'GAD-7',
        name: 'GAD-7',
        measures: 'Anxiety',
        questions: 7,
        time: '2-4 min',
        description: 'Screens for symptoms commonly associated with generalized anxiety disorder.'
    },
    {
        id: 'DASS-21',
        name: 'DASS-21',
        measures: 'Depression, Anxiety, Stress',
        questions: 21,
        time: '5-10 min',
        description: 'A comprehensive self-report scale designed to measure the negative emotional states of depression, anxiety and stress.'
    },
    {
        id: 'PHQ-9',
        name: 'PHQ-9',
        measures: 'Depressive Symptoms',
        questions: 9,
        time: '3-5 min',
        description: 'A screening tool used to monitor the severity of depression and response to treatment.'
    },
    {
        id: 'WHO-5',
        name: 'WHO-5',
        measures: 'Psychological Well-being',
        questions: 5,
        time: '1-2 min',
        description: 'A short self-reported measure of current mental well-being over the last two weeks.'
    }
];

const PublicAssessments = () => {
    const { t } = useTranslation();
    const { user, setIsAuthModalOpen } = useAuth();
    const navigate = useNavigate();

    const handleTakeAssessment = (id) => {
        if (!user) {
            setIsAuthModalOpen(true);
        } else {
            // For now, redirect to dashboard. The user can open it from the dashboard grid.
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-24 pb-20 px-4 relative">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${assessmentBgImage})`, backgroundAttachment: 'fixed' }}
                ></div>
                {/* Semi-transparent overlay to ensure text readability */}
                <div className="absolute inset-0 bg-bg/50 dark:bg-bg/70"></div>
            </div>

            <div className="relative z-10">
                <SEO 
                    title="Mental Wellness Assessments | PSS-10, GAD-7 & More | MindPulse"
                    description="Explore mental wellness screening tools including PSS-10, GAD-7, DASS-21, PHQ-9 and WHO-5 and learn what each assessment measures."
                    canonical="/assessments"
                />
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 relative drop-shadow-md">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 drop-shadow-lg">
                        {t('assessments.title1')} <span className="text-accent">{t('assessments.title2')}</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg">
                        {t('assessments.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {assessments.map((assessment) => (
                        <div key={assessment.id} className="bg-surface rounded-2xl p-6 border border-border flex flex-col hover:border-accent/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-text-primary">{assessment.name}</h2>
                                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase">
                                    {t('assessments.screening')}
                                </span>
                            </div>
                            
                            <div className="mb-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <Activity size={16} />
                                    <span className="font-medium text-text-primary">{t('assessments.measures')}</span> {assessment.measures}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <HelpCircle size={16} />
                                    <span className="font-medium text-text-primary">{t('assessments.questions')}</span> {assessment.questions}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                    <Clock size={16} />
                                    <span className="font-medium text-text-primary">{t('assessments.time')}</span> {assessment.time}
                                </div>
                            </div>
                            
                            <p className="text-text-secondary text-sm leading-relaxed mb-8 flex-grow">
                                {assessment.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <button className="py-3 px-4 rounded-xl border border-border bg-bg text-text-primary font-medium hover:bg-surface transition-colors text-sm text-center">
                                    {t('assessments.learnMore')}
                                </button>
                                <button 
                                    onClick={() => handleTakeAssessment(assessment.id)}
                                    className="py-3 px-4 rounded-xl bg-accent text-white font-medium hover:bg-accent/90 transition-colors text-sm flex items-center justify-center gap-2"
                                >
                                    {user ? t('assessments.takeAssessment') : <><LogIn size={16} /> {t('assessments.loginToTake')}</>}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!user && (
                    <div className="mt-16 bg-surface border border-border rounded-2xl p-8 text-center max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold mb-4">{t('assessments.readyToStart')}</h3>
                        <p className="text-text-secondary mb-6">
                            {t('assessments.readyDesc')}
                        </p>
                        <button 
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-accent text-white px-8 py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors"
                        >
                            {t('assessments.getStarted')}
                        </button>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default PublicAssessments;
