import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
    "Thoughts that you would be better off dead or of hurting yourself in some way"
];

const options = [
    "Not at all",
    "Several days",
    "More than half the days",
    "Nearly every day"
];

const getSeverity = (score) => {
    if (score <= 4) return 'None-minimal';
    if (score <= 9) return 'Mild';
    if (score <= 14) return 'Moderate';
    if (score <= 19) return 'Moderately Severe';
    return 'Severe';
};

const PHQ9 = ({ onComplete, onClose }) => {
    const { t } = useTranslation();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnswer = (val) => {
        const newAnswers = [...answers, val];
        setAnswers(newAnswers);

        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            const score = newAnswers.reduce((a, b) => a + b, 0);
            
            const resultData = {
                type: 'PHQ-9',
                score,
                responses: newAnswers,
                severity: getSeverity(score)
            };

            setResult(resultData);
            onComplete(resultData);
            setIsFinished(true);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-lg bg-surface rounded-xl shadow-xl overflow-hidden overflow-y-auto max-h-[90vh] border border-border"
            >
                {!isFinished ? (
                    <div className="p-6 md:p-8">
                        <div className="flex justify-between items-center mb-8">
                            <span className="px-3 py-1 bg-bg text-text-primary border border-border rounded-full text-xs font-bold uppercase">
                                PHQ-9
                            </span>
                            <span className="text-sm font-medium text-text-secondary">
                                {currentIdx + 1} {t('assessments.of')} {questions.length}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-8 leading-snug">
                            Over the last 2 weeks, how often have you been bothered by: <br/><br/>
                            <span className="text-accent">{questions[currentIdx]}</span>
                        </h3>

                        <div className="space-y-3">
                            {options.map((label, i) => (
                                <button
                                    key={label}
                                    onClick={() => handleAnswer(i)}
                                    className="w-full p-4 rounded-xl bg-bg border border-border hover:border-accent text-left text-sm font-medium transition-colors text-text-primary"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 md:p-8 text-center">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">{t('assessments.complete')}</h3>
                        <p className="text-text-secondary mb-6">{t('assessments.resultsSaved', { name: 'PHQ-9' })}</p>
                        
                        {result && (
                            <div className="bg-bg rounded-xl p-4 border border-border mb-8">
                                <div className="text-sm text-text-secondary mb-1">{t('assessments.yourScore')}</div>
                                <div className="text-3xl font-bold text-accent mb-1">{result.score}</div>
                                <div className="text-sm font-medium text-text-primary">{result.severity}</div>
                            </div>
                        )}

                        <p className="text-xs text-text-secondary mb-8 max-w-xs mx-auto">
                            {t('assessments.disclaimer')}
                        </p>
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-accent text-white rounded-xl font-medium transition-colors hover:bg-accent/90"
                        >
                            {t('assessments.backToDashboard')}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PHQ9;
