import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsOfService = () => {
    const { t } = useTranslation();
    
    return (
        <div className="min-h-screen bg-bg text-text-primary pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto bg-surface border border-border rounded-xl p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-text-primary">
                    {t('footer.terms')}
                </h1>
                
                <div className="space-y-6 text-text-secondary leading-relaxed">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing or using MindPulse, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">2. Description of Service</h2>
                        <p>MindPulse provides tools for personal mental wellness tracking, assessments, and related informational content. The service is provided "as is" and "as available".</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">3. User Accounts</h2>
                        <p>When you create an account, you must provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">4. Limitation of Liability</h2>
                        <p>MindPulse shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
