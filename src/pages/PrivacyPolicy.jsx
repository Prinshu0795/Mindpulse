import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
    const { t } = useTranslation();
    
    return (
        <div className="min-h-screen bg-bg text-text-primary pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto bg-surface border border-border rounded-xl p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-text-primary">
                    {t('footer.privacy')}
                </h1>
                
                <div className="space-y-6 text-text-secondary leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when using MindPulse. This includes account information, mood check-ins, assessment results, and any other data you choose to share.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, as well as to personalize your experience and provide insights into your mental wellness patterns.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">3. Data Security</h2>
                        <p>We prioritize the security of your personal information and employ industry-standard encryption and security measures to protect your data from unauthorized access.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">4. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us through our Contact page.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
