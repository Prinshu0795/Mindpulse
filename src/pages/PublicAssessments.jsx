import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Clock, HelpCircle, Activity, ChevronRight, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { useNavigate } from 'react-router-dom';

const assessments = [
    {
        id: 'PSS-10',
        name: 'PSS-10',
        title: 'Perceived Stress Scale',
        measures: 'Perceived Stress',
        questions: 10,
        time: '3-5 min',
        description: 'Measures the degree to which situations in your life are appraised as unpredictable, uncontrollable, and stressful over the recent period.'
    },
    {
        id: 'GAD-7',
        name: 'GAD-7',
        title: 'Generalized Anxiety Disorder',
        measures: 'Anxiety',
        questions: 7,
        time: '2-4 min',
        description: 'Screens for common symptoms of generalized anxiety disorder, assessing tension, excessive worrying, and irritability.'
    },
    {
        id: 'DASS-21',
        name: 'DASS-21',
        title: 'Depression Anxiety Stress Scale',
        measures: 'Depression, Anxiety, Stress',
        questions: 21,
        time: '5-10 min',
        description: 'A comprehensive self-report scale designed to measure three core negative emotional states: depression, anxiety, and perceived tension.'
    },
    {
        id: 'PHQ-9',
        name: 'PHQ-9',
        title: 'Patient Health Questionnaire',
        measures: 'Depressive Symptoms',
        questions: 9,
        time: '3-5 min',
        description: 'A gold-standard screening instrument used globally to identify symptoms of depression, low energy, and changes in sleep or mood.'
    },
    {
        id: 'WHO-5',
        name: 'WHO-5',
        title: 'WHO Well-Being Index',
        measures: 'Psychological Well-being',
        questions: 5,
        time: '1-2 min',
        description: 'A short, positively phrased self-reported measure of subjective emotional well-being and vitality over the past two weeks.'
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
            navigate('/dashboard', { state: { openAssessment: id } });
        }
    };

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-28 pb-20 px-4 sm:px-6 relative transition-colors duration-300">
            <SEO 
                title="Mental Wellness Assessments | PSS-10, GAD-7 & More | MindPulse"
                description="Explore clinically validated mental wellness screening tools including PSS-10, GAD-7, DASS-21, PHQ-9 and WHO-5 to understand your emotional baseline."
                canonical="/assessments"
            />

            {/* Calming glow accents */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-accent/10 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="max-w-6xl mx-auto">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={14} />
                        <span>Evidence-Based Screening</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        {t('assessments.title1')} <span className="text-accent">{t('assessments.title2')}</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        {t('assessments.subtitle')}
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((assessment) => (
                        <div 
                            key={assessment.id} 
                            className="bg-surface rounded-3xl p-6 sm:p-7 border border-border flex flex-col justify-between hover:border-accent/50 transition-all duration-300 shadow-sm hover:shadow-md group"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-black text-text-primary group-hover:text-accent transition-colors">
                                            {assessment.name}
                                        </h2>
                                        <p className="text-xs font-semibold text-text-secondary mt-0.5">
                                            {assessment.title}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider">
                                        {t('assessments.screening')}
                                    </span>
                                </div>
                                
                                <div className="mb-5 p-3.5 bg-bg rounded-2xl border border-border/80 space-y-2 text-xs">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Activity size={14} className="text-accent shrink-0" />
                                        <span><strong className="text-text-primary">{t('assessments.measures')}</strong> {assessment.measures}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <HelpCircle size={14} className="text-accent shrink-0" />
                                        <span><strong className="text-text-primary">{t('assessments.questions')}</strong> {assessment.questions} Questions</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Clock size={14} className="text-accent shrink-0" />
                                        <span><strong className="text-text-primary">{t('assessments.time')}</strong> {assessment.time}</span>
                                    </div>
                                </div>
                                
                                <p className="text-text-secondary text-sm leading-relaxed mb-6">
                                    {assessment.description}
                                </p>
                            </div>

                            <button 
                                onClick={() => handleTakeAssessment(assessment.id)}
                                className="w-full py-3.5 px-4 rounded-2xl bg-accent text-white font-bold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                            >
                                {user ? (
                                    <>
                                        <span>{t('assessments.takeAssessment')}</span>
                                        <ChevronRight size={16} />
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={16} /> 
                                        <span>{t('assessments.loginToTake')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bottom Callout if not logged in */}
                {!user && (
                    <div className="mt-16 bg-surface border border-border rounded-3xl p-8 sm:p-10 text-center max-w-2xl mx-auto shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold mb-2.5 text-text-primary">
                            {t('assessments.readyToStart')}
                        </h3>
                        <p className="text-text-secondary text-sm sm:text-base mb-6 leading-relaxed">
                            {t('assessments.readyDesc')}
                        </p>
                        <button 
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-accent text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-md shadow-accent/20 active:scale-[0.98]"
                        >
                            {t('assessments.getStarted')}
                        </button>
                    </div>
                )}

                {/* Medical Disclaimer Note */}
                <div className="mt-12 text-center text-xs text-text-secondary max-w-xl mx-auto">
                    <p>{t('assessments.disclaimer')}</p>
                </div>

            </div>
        </div>
    );
};

export default PublicAssessments;
