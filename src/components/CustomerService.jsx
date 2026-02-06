import React, { useState } from 'react';
import { Headset, X, Phone, Mail, MessageSquare, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerService = () => {
    const [isOpen, setIsOpen] = useState(false);

    const contactDetails = {
        phone: "6388626778",
        email: "prinshukumarguptap@gmail.com",
        hours: "24/7 Priority Support"
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
                        className="absolute bottom-20 left-0 w-80 bg-white dark:bg-slate shadow-2xl rounded-[2.5rem] border border-sage/20 dark:border-slate/10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-sky p-6 text-slate-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/20 rounded-2xl">
                                    <Headset size={24} />
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold mb-1">Customer Service</h3>
                            <p className="text-sm opacity-80 font-medium flex items-center gap-1">
                                <Clock size={12} /> {contactDetails.hours}
                            </p>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-slate-500 dark:text-sage/60 mb-6 font-medium">
                                Need help with your mental health journey or booking? Connect with our team.
                            </p>

                            <a
                                href={`tel:${contactDetails.phone}`}
                                className="flex items-center gap-4 p-4 bg-sage/10 dark:bg-navy/30 rounded-2xl hover:bg-sky/10 dark:hover:bg-sky/900/20 transition-all border border-transparent hover:border-sky/20 group"
                            >
                                <div className="p-3 bg-sky/20 rounded-xl text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Call Us</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-sage">{contactDetails.phone}</p>
                                </div>
                            </a>

                            <a
                                href={`mailto:${contactDetails.email}`}
                                className="flex items-center gap-4 p-4 bg-sage/10 dark:bg-navy/30 rounded-2xl hover:bg-sky/10 dark:hover:bg-sky/900/20 transition-all border border-transparent hover:border-sky/20 group"
                            >
                                <div className="p-3 bg-sky/20 rounded-xl text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
                                    <Mail size={20} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Email Us</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-sage truncate">{contactDetails.email}</p>
                                </div>
                            </a>

                            <div className="pt-2">
                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 justify-center">
                                    <MessageSquare size={12} />
                                    Average response time: 5 mins
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-sky text-slate-800 rounded-2xl flex items-center justify-center shadow-xl shadow-sky/30 border-2 border-white/50 relative group"
            >
                <Headset size={24} />
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default CustomerService;
