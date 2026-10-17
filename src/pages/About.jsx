import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Brain, Activity, ShieldCheck, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const About = () => {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-bg text-text-primary pt-28 pb-20 px-4 sm:px-6 relative transition-colors duration-300">
            <SEO 
                title="About MindPulse | Mindful, Clinically-Inspired Wellness"
                description="Learn about MindPulse, a personal mental wellness tracking and self-care platform inspired by Wysa to help users track well-being, recognize stress patterns, and build healthier habits."
                canonical="/about"
            />

            {/* Calming glow accents */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-accent/10 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="max-w-5xl mx-auto space-y-20">
                
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                        <Sparkles size={14} />
                        <span>Our Purpose</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        {t('about.title1')}{' '}
                        <span className="text-accent">{t('about.title2')}</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        {t('about.subtitle')}
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3.5">
                        <Link 
                            to="/" 
                            className="inline-flex items-center justify-center gap-2 bg-accent text-white px-7 py-3.5 rounded-2xl font-bold transition-all hover:bg-accent/90 shadow-md shadow-accent/20 active:scale-[0.98]"
                        >
                            <Sparkles size={18} /> 
                            <span>{t('about.startJourney')}</span>
                        </Link>
                        <Link 
                            to="/resources" 
                            className="inline-flex items-center justify-center gap-2 bg-surface text-text-primary border border-border px-7 py-3.5 rounded-2xl font-semibold transition-all hover:border-accent/40 hover:bg-bg shadow-sm"
                        >
                            <BookOpen size={18} className="text-accent" /> 
                            <span>{t('about.exploreResources')}</span>
                        </Link>
                    </div>
                </motion.div>

                {/* What is MindPulse? */}
                <section className="bg-surface border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
                    <div className="max-w-3xl mx-auto text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-3">
                            {t('about.whatIsMindPulse')}
                        </h2>
                        <div className="w-12 h-1 bg-accent rounded-full mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4 text-text-secondary text-base leading-relaxed">
                            <p>{t('about.whatDesc1')}</p>
                            <p>{t('about.whatDesc2')}</p>
                        </div>
                        <div className="bg-bg rounded-2xl p-6 border border-border/80">
                            <ul className="space-y-3">
                                {[
                                    t('about.features.f1'),
                                    t('about.features.f2'),
                                    t('about.features.f3'),
                                    t('about.features.f4'),
                                    t('about.features.f5'),
                                    t('about.features.f6'),
                                    t('about.features.f7')
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm">
                                        <CheckCircle2 className="text-accent shrink-0 mt-0.5" size={17} />
                                        <span className="text-text-primary font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* How it Works (4 Steps) */}
                <section className="space-y-10">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                            {t('about.howItWorks')}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { num: '01', title: t('about.steps.s1.title'), desc: t('about.steps.s1.desc'), icon: <Activity className="text-indigo-500" size={26} /> },
                            { num: '02', title: t('about.steps.s2.title'), desc: t('about.steps.s2.desc'), icon: <CheckCircle2 className="text-emerald-500" size={26} /> },
                            { num: '03', title: t('about.steps.s3.title'), desc: t('about.steps.s3.desc'), icon: <Brain className="text-amber-500" size={26} /> },
                            { num: '04', title: t('about.steps.s4.title'), desc: t('about.steps.s4.desc'), icon: <ArrowRight className="text-accent" size={26} /> }
                        ].map((step) => (
                            <div key={step.num} className="bg-surface border border-border rounded-3xl p-6 text-center hover:border-accent/40 transition-all shadow-sm">
                                <div className="text-5xl font-black text-text-secondary/15 mb-2 select-none">{step.num}</div>
                                <div className="w-12 h-12 rounded-2xl bg-bg border border-border mx-auto flex items-center justify-center mb-4 text-text-primary shadow-sm">
                                    {step.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-text-primary">{step.title}</h3>
                                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mission & Differentiation */}
                <section className="bg-surface border border-border rounded-3xl p-8 sm:p-12 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-extrabold text-text-primary">{t('about.missionTitle')}</h2>
                            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                                {t('about.missionDesc')}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-extrabold text-text-primary">{t('about.diffTitle')}</h2>
                            <ul className="space-y-2.5">
                                {[
                                    t('about.differences.d1'), 
                                    t('about.differences.d2'), 
                                    t('about.differences.d3'), 
                                    t('about.differences.d4'), 
                                    t('about.differences.d5'), 
                                    t('about.differences.d6')
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-text-primary font-medium">
                                        <Sparkles size={15} className="text-accent shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Privacy & Medical Disclaimer */}
                <section className="space-y-6">
                    <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <ShieldCheck size={26} />
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-lg sm:text-xl font-bold text-text-primary">{t('about.privacyTitle')}</h2>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                {t('about.privacyDesc')}
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5 shadow-sm">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Info size={26} />
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-lg sm:text-xl font-bold text-amber-900 dark:text-amber-300">
                                {t('about.disclaimerTitle')}
                            </h2>
                            <p className="text-amber-800/90 dark:text-amber-400/90 text-sm leading-relaxed whitespace-pre-wrap">
                                {t('about.disclaimerDesc').split('**').map((part, index) => 
                                    index % 2 === 1 ? <strong key={index} className="font-bold">{part}</strong> : part
                                )}
                            </p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default About;
