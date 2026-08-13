import React from 'react';
import { useTranslation } from 'react-i18next';

const MedicalDisclaimer = () => {
    const { t } = useTranslation();
    
    return (
        <div className="min-h-screen bg-bg text-text-primary pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto bg-surface border border-border rounded-xl p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-text-primary">
                    {t('footer.disclaimer')}
                </h1>
                
                <div className="space-y-6 text-text-secondary leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">Not Medical Advice</h2>
                        <p>The information, assessments, and wellness tracking tools provided by MindPulse are for educational and informational purposes only. They are not intended as a substitute for professional medical advice, diagnosis, or treatment.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">Consult a Professional</h2>
                        <p>Always seek the advice of your physician, mental health professional, or other qualified health provider with any questions you may have regarding a medical or mental health condition. Never disregard professional medical advice or delay in seeking it because of something you have read or assessed on MindPulse.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">In Case of Emergency</h2>
                        <p>If you think you may have a medical emergency or are experiencing a crisis, call your doctor, emergency services (such as 911), or a local crisis hotline immediately. MindPulse is not equipped to handle emergencies or provide immediate crisis support.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">No Provider-Patient Relationship</h2>
                        <p>Use of the MindPulse platform does not establish a provider-patient relationship between you and MindPulse, its creators, or any affiliates.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default MedicalDisclaimer;
