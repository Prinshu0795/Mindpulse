import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const questions = [
    "I have felt cheerful and in good spirits",
    "I have felt calm and relaxed",
    "I have felt active and vigorous",
    "I woke up feeling fresh and rested",
    "My daily life has been filled with things that interest me"
];

const options = [
    "At no time",
    "Some of the time",
    "Less than half of the time",
    "More than half of the time",
    "Most of the time",
    "All of the time"
];

const WHO5 = ({ onComplete, onClose }) => {
    const { t } = useTranslation();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnswer = (val) => {
        // Options are displayed 0 to 5, so score is the index
        const newAnswers = [...answers, val];
        setAnswers(newAnswers);

        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        } else {
            const rawScore = newAnswers.reduce((a, b) => a + b, 0);
            const percentage = rawScore * 4;
            
            const resultData = {
                type: 'WHO-5',
                score: percentage,
                responses: newAnswers,
                severity: percentage < 50 ? 'Low well-being' : 'Good well-being'
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
                                WHO-5
                            </span>
                            <span className="text-sm font-medium text-text-secondary">
                                {currentIdx + 1} {t('assessments.of')} {questions.length}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-8 leading-snug">
                            Over the last 2 weeks: <br/><br/>
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
                        <p className="text-text-secondary mb-6">{t('assessments.resultsSaved', { name: 'WHO-5 well-being score' })}</p>
                        
                        {result && (
                            <div className="bg-bg rounded-xl p-4 border border-border mb-8">
                                <div className="text-sm text-text-secondary mb-1">{t('assessments.yourScore')}</div>
                                <div className="text-3xl font-bold text-accent mb-1">{result.score}%</div>
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

export default WHO5;
