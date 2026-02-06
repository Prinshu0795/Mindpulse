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
    const [isVoiceMode, setIsVoiceMode] = useState(true); // Default to on
    const [recognition, setRecognition] = useState(null);

    const languages = ["English", "Hindi", "Spanish"];

    // Update initial message when user logs in/out
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
            };

            recog.onend = () => {
                setIsListening(false);
            };

            recog.onerror = () => {
                setIsListening(false);
            };

            setRecognition(recog);
        }
    }, []);

    const speakResponse = useCallback((text) => {
        if (!isVoiceMode) return; // Don't speak if voice mode is off

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);

            const langMap = {
                'English': 'en-US',
                'Hindi': 'hi-IN',
                'Spanish': 'es-ES'
            };
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
                        content: `You are a compassionate mental health support assistant named MindPulse AI. 
            The current user's name is ${user ? user.name : 'Unknown'}. 
            The current selected language for communication is ${language}. 
            Keep your responses concise, soothing, and empathetic. 
            If you know the user's name, use it naturally in conversation to make them feel heard.
            Always respond in ${language}.`,
                    },
                    {
                        role: "user",
                        content: textToSend,
                    },
                ],
                model: "llama-3.3-70b-versatile",
            });

            const responseText = completion.choices[0]?.message?.content || "I couldn't generate a response.";
            setMessages(prev => [...prev, { text: responseText, isAI: true }]);
            speakResponse(responseText);
        } catch (error) {
            console.error("Groq Error:", error);
            setMessages(prev => [...prev, {
                text: `I'm having trouble connecting to my creative centers. Error: ${error.message || 'Unknown'}. Please try again shortly.`,
                isAI: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognition?.stop();
        } else {
            if (recognition) {
                const langMap = {
                    'English': 'en-US',
                    'Hindi': 'hi-IN',
                    'Spanish': 'es-ES'
                };
                recognition.lang = langMap[language] || 'en-US';
                recognition.start();
                setIsListening(true);
            } else {
                alert("Speech recognition is not supported in this browser.");
            }
        }
    };

    return (
        <section className="py-20 px-4">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-slate/50 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-sage/20 dark:border-slate/10"
                >
                    <div className="p-6 border-b border-sage/10 dark:border-slate/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-semibold text-slate dark:text-sage">Virtual Connection</h2>
                            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">Live AI</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Voice Mode Toggle */}
                            <button
                                onClick={() => setIsVoiceMode(!isVoiceMode)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium ${isVoiceMode
                                        ? 'bg-sky/20 text-sky-700 dark:text-sky-400'
                                        : 'bg-slate-100 text-slate-500 dark:bg-navy/40 dark:text-sage/40'
                                    }`}
                                title={isVoiceMode ? "Turn Off Voice Mode" : "Turn On Voice Mode"}
                            >
                                {isVoiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
                                <span className="hidden sm:inline">{isVoiceMode ? "Voice On" : "Text Only"}</span>
                            </button>

                            <div className="flex items-center gap-2 bg-sage/30 dark:bg-navy/50 p-1 rounded-full px-3">
                                <Globe size={16} className="text-slate-500" />
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-transparent text-sm focus:outline-none cursor-pointer"
                                >
                                    {languages.map(lang => (
                                        <option key={lang} value={lang} className="text-black">{lang}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="h-96 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: msg.isAI ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i}
                                className={`flex ${msg.isAI ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`relative group max-w-[80%] p-4 rounded-2xl ${msg.isAI
                                    ? 'bg-sky dark:bg-navy text-slate-800 dark:text-sage rounded-tl-none'
                                    : 'bg-sage dark:bg-slate text-slate-800 dark:text-sage rounded-tr-none'
                                    }`}>
                                    {msg.text}
                                    {msg.isAI && (
                                        <button
                                            onClick={() => speakResponse(msg.text)}
                                            className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-sky transition-all"
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-sky/50 dark:bg-navy/50 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <Loader2 className="animate-spin text-sky-600" size={16} />
                                    <span className="text-sm italic">MindPulse is thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-sage/10 dark:border-slate/10 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? "Listening..." : "Type or speak to me..."}
                            disabled={isLoading}
                            className="flex-1 bg-sage/20 dark:bg-navy/30 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-sky/50 disabled:opacity-50"
                        />
                        <button
                            onClick={toggleListening}
                            disabled={isLoading}
                            className={`p-3 rounded-full transition-all ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-sage/40 dark:bg-navy/40 text-slate-600 dark:text-sage hover:bg-sky/30'
                                }`}
                            title="Voice Input"
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading}
                            className="bg-sky hover:bg-sky/80 text-slate-800 p-3 rounded-full transition-all disabled:opacity-50 shadow-lg shadow-sky/20"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ChatSection;
