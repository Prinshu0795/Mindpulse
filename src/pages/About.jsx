import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Brain, Activity, Shield, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-bg text-text-primary">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 max-w-6xl mx-auto text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        {t('about.title1')} <br className="hidden md:block" />
                        <span className="text-accent">{t('about.title2')}</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-lg">
                        {t('about.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/" className="inline-flex items-center justify-center gap-2 bg-accent text-white px-8 py-4 rounded-xl font-medium transition-colors hover:bg-accent/90">
                            <Sparkles size={18} /> {t('about.startJourney')}
                        </Link>
                        <Link to="/resources" className="inline-flex items-center justify-center gap-2 bg-surface text-text-primary border border-border px-8 py-4 rounded-xl font-medium transition-colors hover:border-accent/50">
                            <BookOpen size={18} /> {t('about.exploreResources')}
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* What is MindPulse? */}
            <section className="py-20 px-4 bg-surface border-y border-border">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">{t('about.whatIsMindPulse')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4 text-text-secondary text-lg leading-relaxed">
                            <p>{t('about.whatDesc1')}</p>
                            <p>{t('about.whatDesc2')}</p>
                        </div>
                        <div className="bg-bg rounded-xl p-6 border border-border">
                            <ul className="space-y-4">
                                {[
                                    t('about.features.f1'),
                                    t('about.features.f2'),
                                    t('about.features.f3'),
                                    t('about.features.f4'),
                                    t('about.features.f5'),
                                    t('about.features.f6'),
                                    t('about.features.f7')
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircleIcon className="text-accent shrink-0 mt-0.5" />
                                        <span className="text-text-secondary font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 px-4 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-16 text-center">{t('about.howItWorks')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { num: '01', title: t('about.steps.s1.title'), desc: t('about.steps.s1.desc'), icon: <Activity className="text-indigo-500" size={32} /> },
                        { num: '02', title: t('about.steps.s2.title'), desc: t('about.steps.s2.desc'), icon: <CheckCircleIcon className="text-emerald-500" size={32} /> },
                        { num: '03', title: t('about.steps.s3.title'), desc: t('about.steps.s3.desc'), icon: <Brain className="text-amber-500" size={32} /> },
                        { num: '04', title: t('about.steps.s4.title'), desc: t('about.steps.s4.desc'), icon: <ArrowRight className="text-accent" size={32} /> }
                    ].map((step) => (
                        <div key={step.num} className="relative text-center">
                            <div className="text-6xl font-black text-text-secondary/10 mb-4">{step.num}</div>
                            <div className="absolute top-4 left-1/2 -translate-x-1/2">{step.icon}</div>
                            <h3 className="text-xl font-bold mt-4 mb-2">{step.title}</h3>
                            <p className="text-text-secondary font-medium">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission & Difference */}
            <section className="py-20 px-4 bg-surface border-y border-border">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{t('about.missionTitle')}</h2>
                        <p className="text-text-secondary leading-relaxed">
                            {t('about.missionDesc')}
                        </p>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{t('about.diffTitle')}</h2>
                        <ul className="space-y-3">
                            {[
                                t('about.differences.d1'), 
                                t('about.differences.d2'), 
                                t('about.differences.d3'), 
                                t('about.differences.d4'), 
                                t('about.differences.d5'), 
                                t('about.differences.d6')
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-2 text-text-secondary">
                                    <Sparkles size={16} className="text-accent" /> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Privacy & Disclaimer */}
            <section className="py-20 px-4 max-w-4xl mx-auto">
                <div className="bg-bg border border-border rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-2">{t('about.privacyTitle')}</h2>
                        <p className="text-text-secondary">
                            {t('about.privacyDesc')}
                        </p>
                    </div>
                </div>

                <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-8 flex flex-col md:flex-row items-start gap-6">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <Info size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-amber-800 dark:text-amber-500 mb-2">{t('about.disclaimerTitle')}</h2>
                        <p className="text-amber-700/80 dark:text-amber-400/80 font-medium whitespace-pre-wrap">
                            {t('about.disclaimerDesc').split('**').map((part, index) => 
                                index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                            )}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

const CheckCircleIcon = ({ className }) => (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default About;
