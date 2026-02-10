import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-12 border-t border-slate-200 dark:border-slate-800 mt-20">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-white font-bold text-xl">
                    <div className="w-8 h-8 bg-sky-500 text-white rounded-lg flex items-center justify-center">M</div>
                    MindPulse
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-8 text-center">
                    <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                    <span>Your data is encrypted. We prioritize your privacy and mental well-being.</span>
                </div>

                <p className="text-slate-400 dark:text-slate-500 text-xs">
                    © 2026 MindPulse. Built with care by humans.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
