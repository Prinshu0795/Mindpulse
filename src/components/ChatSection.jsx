import React, { useState, useEffect, useCallback } from 'react';
import { Send, Globe, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import Groq from "groq-sdk";
import { useAuth } from '../context/AuthContext';

const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

const ChatSection = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { text: `Hello${user ? ' ' + user.name : ''}! I'm MindPulse AI. I'm here to support you. How are you feeling today?`, isAI: true }
    ]);
    const [input, setInput] = useState("");
    const [language, setLanguage] = useState("English");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(true);
    const [recognition, setRecognition] = useState(null);

    const languages = ["English", "Hindi", "Spanish"];

    useEffect(() => {
        setMessages(prev => {
            const firstMsg = prev[0];
            if (firstMsg && firstMsg.isAI) {
                const newFirstMsg = {
                    ...firstMsg,
                    text: `Hello${user ? ' ' + user.name : ''}! I'm MindPulse AI. I'm here to support you. How are you feeling today?`
                };
                return [newFirstMsg, ...prev.slice(1)];
            }
            return prev;
        });
    }, [user]);

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
            const langMap = { 'English': 'en-US', 'Hindi': 'hi-IN', 'Spanish': 'es-ES' };
            utterance.lang = langMap[language] || 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    }, [language, isVoiceMode]);

    const handleSend = async (customInput = null) => {
        const textToSend = customInput || input;
        if (!textToSend.trim() || isLoading) return;

        const userMessage = { text: textToSend, isAI: false };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a compassionate mental health support assistant named MindPulse AI. The current user's name is ${user ? user.name : 'Unknown'}. The current selected language for communication is ${language}. Keep your responses concise, soothing, and empathetic. If you know the user's name, use it naturally in conversation to make them feel heard. Always respond in ${language}.`,
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
                const langMap = { 'English': 'en-US', 'Hindi': 'hi-IN', 'Spanish': 'es-ES' };
                recognition.lang = langMap[language] || 'en-US';
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
                            <h2 className="text-xl font-bold text-text-primary">Virtual Connection</h2>
                            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/30">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">Live AI</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsVoiceMode(!isVoiceMode)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border min-h-[44px] ${isVoiceMode
                                    ? 'bg-accent/10 border-accent/20 text-accent'
                                    : 'bg-bg border-border text-text-secondary hover:text-text-primary'
                                    }`}
                                title={isVoiceMode ? "Turn Off Voice Mode" : "Turn On Voice Mode"}
                            >
                                {isVoiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                <span className="hidden sm:inline">{isVoiceMode ? "Voice On" : "Text Only"}</span>
                            </button>

                            <div className="flex items-center gap-2 bg-bg border border-border px-3 py-2 rounded-lg min-h-[44px]">
                                <Globe size={16} className="text-text-secondary" />
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer"
                                >
                                    {languages.map(lang => (
                                        <option key={lang} value={lang} className="text-slate-900">{lang}</option>
                                    ))}
                                </select>
                            </div>
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
                                            aria-label="Speak response"
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
                                    <span className="text-sm font-medium text-text-secondary">MindPulse is thinking...</span>
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
                            placeholder={isListening ? "Listening..." : "Type or speak..."}
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
                            title="Voice Input"
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
