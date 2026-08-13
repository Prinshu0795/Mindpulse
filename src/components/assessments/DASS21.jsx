import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const questions = [
    "I found it hard to wind down",
    "I was aware of dryness of my mouth",
    "I couldn't seem to experience any positive feeling at all",
    "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)",
    "I found it difficult to work up the initiative to do things",
    "I tended to over-react to situations",
    "I experienced trembling (e.g. in the hands)",
    "I felt that I was using a lot of nervous energy",
    "I was worried about situations in which I might panic and make a fool of myself",
    "I felt that I had nothing to look forward to",
    "I found myself getting agitated",
    "I found it difficult to relax",
    "I felt down-hearted and blue",
    "I was intolerant of anything that kept me from getting on with what I was doing",
    "I felt I was close to panic",
    "I was unable to become enthusiastic about anything",
    "I felt I wasn't worth much as a person",
    "I felt that I was rather touchy",
    "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase, heart missing a beat)",
    "I felt scared without any good reason",
    "I felt that life was meaningless"
];

const options = [
    "Did not apply to me at all",
    "Applied to me to some degree, or some of the time",
    "Applied to me to a considerable degree or a good part of time",
    "Applied to me very much or most of the time"
];

const depressionIndices = [2, 4, 9, 12, 15, 16, 20];
const anxietyIndices = [1, 3, 6, 8, 14, 18, 19];
const stressIndices = [0, 5, 7, 10, 11, 13, 17];

const DASS21 = ({ onComplete, onClose }) => {
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
            let depression = 0;
            let anxiety = 0;
            let stress = 0;

            newAnswers.forEach((ans, idx) => {
                if (depressionIndices.includes(idx)) depression += ans;
                else if (anxietyIndices.includes(idx)) anxiety += ans;
                else if (stressIndices.includes(idx)) stress += ans;
            });

            // Multiply by 2 for standard DASS full-scale equivalent
            depression *= 2;
            anxiety *= 2;
            stress *= 2;

            const resultData = {
                type: 'DASS-21',
                subScores: { depression, anxiety, stress },
                responses: newAnswers,
                severity: `D:${depression}, A:${anxiety}, S:${stress}`
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
                        <div className="flex items-center justify-between mb-8">
                            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase">
                                DASS-21
                            </span>
                            <span className="text-sm font-medium text-text-secondary">
                                {currentIdx + 1} {t('assessments.of')} {questions.length}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-text-primary mb-8 leading-snug">
                            {questions[currentIdx]}
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
                        <p className="text-text-secondary mb-6">{t('assessments.resultsSaved', { name: 'DASS-21' })}</p>
                        
                        {result && (
                            <div className="bg-bg rounded-xl p-4 border border-border mb-8 text-left space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-secondary">{t('assessments.depression')}</span>
                                    <span className="font-bold text-accent">{result.subScores.depression}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-secondary">{t('assessments.anxiety')}</span>
                                    <span className="font-bold text-accent">{result.subScores.anxiety}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-text-secondary">{t('assessments.stress')}</span>
                                    <span className="font-bold text-accent">{result.subScores.stress}</span>
                                </div>
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

export default DASS21;
