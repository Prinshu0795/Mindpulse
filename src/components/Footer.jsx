import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-12 border-t border-sage/20 dark:border-slate/10 mt-20">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-sage font-bold text-xl">
                    <div className="w-8 h-8 bg-sky rounded-lg flex items-center justify-center">M</div>
                    MindPulse
                </div>

                <div className="flex items-center gap-2 text-slate-500 dark:text-sage/40 text-sm mb-8">
                    <ShieldCheck size={16} />
                    <span>Your data is encrypted. We prioritize your privacy and mental well-being above all.</span>
                </div>

                <p className="text-slate-400 dark:text-sage/20 text-xs">
                    © 2026 MindPulse. Built with care for virtual connection.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
