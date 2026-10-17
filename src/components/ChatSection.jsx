import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Globe, Loader2, Mic, MicOff, Volume2, VolumeX, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Groq from "groq-sdk";
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

const ChatSection = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    
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

    // Wysa-style quick reflection prompts
    const quickPrompts = i18n.language === 'hi' ? [
        "मुझे थोड़ी चिंता हो रही है",
        "शांत होने में मदद करें",
        "नींद नहीं आ रही है",
        "आज बहुत तनाव था"
    ] : [
        "I'm feeling a bit anxious",
        "Help me calm down",
        "Trouble sleeping tonight",
        "I had a stressful day"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

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
                        content: `You are a compassionate mental health support assistant named MindPulse AI. The current user's name is ${user ? user.name : 'Friend'}. The current selected language for communication is ${languageName}. Keep your responses concise, soothing, empathetic, and grounded like a warm mental wellness companion inspired by Wysa. If you know the user's name, use it naturally in conversation to make them feel heard. Always respond in ${languageName}. Do not make clinical diagnoses. Use the following user context to subtly inform your responses if helpful: ${contextStr}`,
                    },
                    { role: "user", content: textToSend },
                ],
                model: "openai/gpt-oss-120b",
            });

            const responseText = completion.choices[0]?.message?.content || "I am here with you. Take a gentle breath.";
            setMessages(prev => [...prev, { text: responseText, isAI: true }]);
            speakResponse(responseText);
        } catch (error) {
            console.error("Groq Error:", error);
            setMessages(prev => [...prev, { text: `I had trouble connecting: ${error.message || 'Please check your connection'}. I'm still here for you.`, isAI: true }]);
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
        <section className="px-2 sm:px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-surface rounded-3xl border border-border overflow-hidden flex flex-col shadow-sm transition-colors duration-300">
                    
                    {/* Header */}
                    <div className="p-4 sm:p-5 border-b border-border flex flex-wrap justify-between items-center gap-4 bg-surface/80 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-accent text-white flex items-center justify-center font-bold text-base shadow-sm">
                                M
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base sm:text-lg font-bold text-text-primary">{t('chat.title')}</h2>
                                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">{t('chat.liveAi')}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-text-secondary">Empathetic listening • 24/7 private companion</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsVoiceMode(!isVoiceMode)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-xs font-semibold border ${
                                    isVoiceMode
                                        ? 'bg-accent/10 border-accent/30 text-accent'
                                        : 'bg-bg border-border text-text-secondary hover:text-text-primary'
                                }`}
                                title={isVoiceMode ? t('chat.turnOffVoice') : t('chat.turnOnVoice')}
                            >
                                {isVoiceMode ? <Volume2 size={15} /> : <VolumeX size={15} />}
                                <span className="hidden sm:inline">{isVoiceMode ? t('chat.voiceOn') : t('chat.textOnly')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages Feed */}
                    <div className="h-[420px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-bg/40">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex items-start gap-2.5 ${msg.isAI ? 'justify-start' : 'justify-end'}`}>
                                {msg.isAI && (
                                    <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-sm">
                                        M
                                    </div>
                                )}
                                <div className={`relative group max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl ${
                                    msg.isAI
                                        ? 'bg-surface border border-border text-text-primary rounded-tl-sm shadow-sm'
                                        : 'bg-accent text-white rounded-tr-sm shadow-md shadow-accent/15'
                                }`}>
                                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                    {msg.isAI && (
                                        <button
                                            onClick={() => speakResponse(msg.text)}
                                            className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-text-secondary hover:text-accent transition-all"
                                            aria-label={t('chat.speakResponse')}
                                        >
                                            <Volume2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex items-center gap-2.5 justify-start">
                                <div className="w-8 h-8 rounded-xl bg-accent text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                                    M
                                </div>
                                <div className="bg-surface border border-border p-3.5 rounded-2xl rounded-tl-sm flex items-center gap-2.5 shadow-sm">
                                    <Loader2 className="animate-spin text-accent" size={15} />
                                    <span className="text-xs sm:text-sm font-medium text-text-secondary">{t('chat.thinking')}</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick suggestion chips (Wysa style) */}
                    <div className="px-4 py-2 border-t border-border bg-surface flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider shrink-0 flex items-center gap-1">
                            <Sparkles size={12} className="text-accent" />
                            Reflect:
                        </span>
                        {quickPrompts.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(prompt)}
                                disabled={isLoading}
                                className="px-3 py-1 rounded-full text-xs font-medium bg-bg border border-border text-text-secondary hover:text-accent hover:border-accent/40 whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    {/* Composer */}
                    <div className="p-3 sm:p-4 bg-surface border-t border-border flex items-center gap-2 sm:gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? t('chat.listening') : t('chat.typeOrSpeak')}
                            disabled={isLoading}
                            className="flex-1 min-w-0 bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:opacity-50 text-text-primary text-sm sm:text-base min-h-[44px]"
                        />
                        <button
                            onClick={toggleListening}
                            disabled={isLoading}
                            className={`p-3 flex items-center justify-center rounded-xl transition-colors border min-w-[44px] min-h-[44px] ${
                                isListening
                                    ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse'
                                    : 'bg-bg border-border text-text-secondary hover:text-text-primary hover:bg-surface'
                            }`}
                            title={t('chat.voiceInput')}
                        >
                            {isListening ? <MicOff size={19} /> : <Mic size={19} />}
                        </button>
                        <button
                            id="send-trigger"
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            className="bg-accent hover:bg-accent/90 text-white p-3 flex items-center justify-center rounded-xl transition-all disabled:opacity-40 min-w-[44px] min-h-[44px] shadow-sm active:scale-95"
                        >
                            <Send size={19} />
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ChatSection;
