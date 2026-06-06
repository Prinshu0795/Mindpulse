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
                        initial={{ opacity: 0, scale: 0.95, x: -10, y: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, x: -10, y: 10 }}
                        className="absolute bottom-20 left-0 w-80 bg-surface shadow-xl rounded-xl border border-border overflow-hidden"
                    >
                        <div className="bg-accent p-6 text-white">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Headset size={24} />
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <h3 className="text-lg font-bold mb-1">Customer Service</h3>
                            <p className="text-xs opacity-90 font-medium flex items-center gap-1.5">
                                <Clock size={12} /> {contactDetails.hours}
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-sm text-text-secondary mb-6 font-medium">
                                Need help with your mental health journey or booking? Connect with our team.
                            </p>

                            <a
                                href={`tel:${contactDetails.phone}`}
                                className="flex items-center gap-4 p-3 bg-bg rounded-lg hover:bg-surface transition-colors border border-border group"
                            >
                                <div className="p-2.5 bg-surface border border-border rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-text-secondary">Call Us</p>
                                    <p className="text-sm font-bold text-text-primary">{contactDetails.phone}</p>
                                </div>
                            </a>

                            <a
                                href={`mailto:${contactDetails.email}`}
                                className="flex items-center gap-4 p-3 bg-bg rounded-lg hover:bg-surface transition-colors border border-border group"
                            >
                                <div className="p-2.5 bg-surface border border-border rounded-lg text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                    <Mail size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[10px] uppercase font-bold text-text-secondary">Email Us</p>
                                    <p className="text-sm font-bold text-text-primary truncate">{contactDetails.email}</p>
                                </div>
                            </a>

                            <div className="pt-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-text-secondary justify-center">
                                    <MessageSquare size={14} />
                                    Average response time: 5 mins
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors relative"
            >
                {isOpen ? <X size={24} /> : <Headset size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-slate-900"></span>
                    </span>
                )}
            </button>
        </div>
    );
};

export default CustomerService;
