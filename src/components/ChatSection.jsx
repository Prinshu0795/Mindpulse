import React, { useState, useEffect, useCallback } from 'react';
import { Send, Globe, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import Groq from "groq-sdk";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

const ChatSection = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    
    // Derived language name for prompt
    const languageName = i18n.language === 'hi' ? 'Hindi' : 'English';

    const [messages, setMessages] = useState([
        { text: t('chat.initialMsg', { name: user ? ' ' + user.name : '' }), isAI: true }
    ]);
    const [analyticsContext, setAnalyticsContext] = useState(null);
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const API_URL = `${BASE_URL.replace(/\/$/, '')}/api`;
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(true);
    const [recognition, setRecognition] = useState(null);

    // Initial message language effect
    useEffect(() => {
        setMessages(prev => {
            const firstMsg = prev[0];
            if (firstMsg && firstMsg.isAI) {
                const newFirstMsg = {
                    ...firstMsg,
                    text: t('chat.initialMsg', { name: user ? ' ' + user.name : '' })
                };
                return [newFirstMsg, ...prev.slice(1)];
            }
            return prev;
        });
    }, [user, t, i18n.language]);

    useEffect(() => {
        const fetchContext = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('mindpulse_token');
                if (!token) return;
                const response = await fetch(`${API_URL}/analytics/overview`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setAnalyticsContext(data.data);
                }
            } catch (e) {
                console.error("Error fetching context:", e);
            }
        };
        fetchContext();
    }, [user, API_URL]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = false;
            recog.interimResults = false;

            recog.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                setTimeout(() => {
                    document.getElementById('send-trigger')?.click();
                }, 100);
            };

            recog.onend = () => setIsListening(false);
            recog.onerror = () => setIsListening(false);

            setRecognition(recog);
        }
    }, []);

    const speakResponse = useCallback((text) => {
        if (!isVoiceMode) return;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const langMap = { 'en': 'en-US', 'hi': 'hi-IN' };
            utterance.lang = langMap[i18n.language] || 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    }, [i18n.language, isVoiceMode]);

    const handleSend = async (customInput = null) => {
        const textToSend = customInput || input;
        if (!textToSend.trim() || isLoading) return;

        const userMessage = { text: textToSend, isAI: false };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            let contextStr = "";
            if (analyticsContext) {
                const { checkins, topTriggers } = analyticsContext;
                if (checkins && checkins.length > 0) {
                    const latest = checkins[checkins.length - 1];
                    const triggersStr = topTriggers && topTriggers.length > 0 ? topTriggers.slice(0, 3).map(t => t.name).join(', ') : 'None recorded';
                    contextStr = `\nUser's recent check-in: Stress Level ${latest.stressLevel}/10, Anxiety Level ${latest.anxietyLevel}/10, Mood: ${latest.mood}, Sleep Quality: ${latest.sleepQuality}/10. Top stress triggers: ${triggersStr}.`;
                }
            }

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a compassionate mental health support assistant named MindPulse AI. The current user's name is ${user ? user.name : 'Unknown'}. The current selected language for communication is ${languageName}. Keep your responses concise, soothing, and empathetic. If you know the user's name, use it naturally in conversation to make them feel heard. Always respond in ${languageName}. Do not make medical diagnoses. Use the following user context to subtly inform your responses if helpful: ${contextStr}`,
                    },
                    { role: "user", content: textToSend },
                ],
                model: "llama-3.3-70b-versatile",
            });

            const responseText = completion.choices[0]?.message?.content || "I couldn't generate a response.";
            setMessages(prev => [...prev, { text: responseText, isAI: true }]);
            speakResponse(responseText);
        } catch (error) {
            console.error("Groq Error:", error);
            setMessages(prev => [...prev, { text: `Error: ${error.message || 'Unknown'}. Please try again shortly.`, isAI: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognition?.stop();
        } else {
            if (recognition) {
                const langMap = { 'en': 'en-US', 'hi': 'hi-IN' };
                recognition.lang = langMap[i18n.language] || 'en-US';
                recognition.start();
                setIsListening(true);
            } else {
                alert("Speech recognition is not supported in this browser.");
            }
        }
    };

    return (
        <section className="px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col">
                    <div className="p-4 md:p-6 border-b border-border flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-text-primary">{t('chat.title')}</h2>
                            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/30">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">{t('chat.liveAi')}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsVoiceMode(!isVoiceMode)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border min-h-[44px] ${isVoiceMode
                                    ? 'bg-accent/10 border-accent/20 text-accent'
                                    : 'bg-bg border-border text-text-secondary hover:text-text-primary'
                                    }`}
                                title={isVoiceMode ? t('chat.turnOffVoice') : t('chat.turnOnVoice')}
                            >
                                {isVoiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                <span className="hidden sm:inline">{isVoiceMode ? t('chat.voiceOn') : t('chat.textOnly')}</span>
                            </button>
                        </div>
                    </div>

                    <div className="h-[400px] overflow-y-auto p-4 md:p-6 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}>
                                <div className={`relative group max-w-[85%] md:max-w-[75%] p-4 rounded-xl ${msg.isAI
                                    ? 'bg-bg border border-border text-text-primary rounded-tl-sm'
                                    : 'bg-accent text-white rounded-tr-sm'
                                    }`}>
                                    <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                                    {msg.isAI && (
                                        <button
                                            onClick={() => speakResponse(msg.text)}
                                            className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-text-secondary hover:text-accent transition-all"
                                            aria-label={t('chat.speakResponse')}
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-bg border border-border p-4 rounded-xl rounded-tl-sm flex items-center gap-3">
                                    <Loader2 className="animate-spin text-accent" size={16} />
                                    <span className="text-sm font-medium text-text-secondary">{t('chat.thinking')}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-surface border-t border-border flex items-center gap-2 md:gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? t('chat.listening') : t('chat.typeOrSpeak')}
                            disabled={isLoading}
                            className="flex-1 min-w-0 bg-bg border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 text-text-primary text-sm md:text-base min-h-[44px]"
                        />
                        <button
                            onClick={toggleListening}
                            disabled={isLoading}
                            className={`p-3 flex items-center justify-center rounded-lg transition-colors border min-w-[44px] min-h-[44px] ${isListening
                                ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
                                : 'bg-bg border-border text-text-secondary hover:text-text-primary hover:bg-surface'
                                }`}
                            title={t('chat.voiceInput')}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        <button
                            id="send-trigger"
                            onClick={() => handleSend()}
                            disabled={isLoading}
                            className="bg-accent hover:bg-accent/90 text-white p-3 flex items-center justify-center rounded-lg transition-colors disabled:opacity-50 min-w-[44px] min-h-[44px]"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChatSection;
