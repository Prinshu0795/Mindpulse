import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-12 border-t border-border mt-20 bg-bg">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4 text-text-primary font-bold text-xl">
                    <div className="w-8 h-8 bg-accent text-white rounded-lg flex items-center justify-center">M</div>
                    MindPulse
                </div>

                <div className="flex items-center gap-2 text-text-secondary text-sm mb-8 text-center font-medium">
                    <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                    <span>Your data is encrypted. We prioritize your privacy and mental well-being.</span>
                </div>

                <p className="text-text-secondary opacity-80 text-xs font-medium">
                    © 2026 MindPulse. Built with care by humans.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
