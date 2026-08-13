import React, { useState, useMemo } from 'react';
import { Phone, MapPin, Award, IndianRupee, X, Search, Map, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Experts = () => {
    const { t } = useTranslation();
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("All India");

    const cities = [t('experts.allIndia'), "Lucknow", "Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Kolkata", "Chennai"];

    const allExperts = [
        { id: 1, name: "Dr. Isha Sherma", role: "Senior Psychologist", location: "Lucknow", qualification: "Gold Medalist in Psychology", phone: "7054265144", charges: "800", bio: "Specializing in mental well-being and emotional resilience with years of clinical experience.", clinic: "Isha's Healing Center, Hazratganj", featured: true },
        { id: 2, name: "Dr. Samir Parikh", role: "Psychiatrist (Mental Health)", location: "Delhi", qualification: "MBBS, MD, DPM", phone: "9811000000", charges: "1,500+", bio: "Renowned psychiatrist specializing in mental health and community outreach programs.", clinic: "Fortis Memorial Research Institute" },
        { id: 3, name: "Dr. Ajit Dandekar", role: "Psychiatrist (Stress Mgmt)", location: "Mumbai", qualification: "MBBS, MD, DPM", phone: "9820000000", charges: "2,000+", bio: "Expert in clinical psychiatry and stress management for busy professionals.", clinic: "Dandekar's Psychiatric Clinic" },
        { id: 4, name: "Sachin Bhatnagar", role: "Top Rated Career Counselor", location: "Mumbai", qualification: "Career Coach", phone: "9830000000", charges: "2,500+", bio: "Guiding students and professionals towards fulfilling careers with expert coaching.", clinic: "Career Hub International" },
        { id: 5, name: "Dr. Ravi Prakash", role: "Psychiatrist (De-addiction)", location: "Bangalore", qualification: "MBBS, MD, DPM", phone: "9840000000", charges: "750 - 1,200", bio: "Dedicated specialist in de-addiction and rehabilitation therapies.", clinic: "Prakash De-addiction & Rehab" },
        { id: 6, name: "Dr. M.B. Pethe", role: "Senior Psychiatrist", location: "Pune", qualification: "MBBS, MD", phone: "9850000000", charges: "1,000", bio: "Experienced senior psychiatrist focusing on comprehensive clinical care.", clinic: "Pethe Clinic & Counseling Center" },
        { id: 7, name: "Amritansh Tiwari", role: "Career Counselor & Trainer", location: "Pune", qualification: "Career Expert", phone: "9860000000", charges: "1,000/hr", bio: "Empowering individuals through professional career guidance and training skills.", clinic: "Tiwari Career Academy" },
        { id: 8, name: "Dr. S. Swetha Reddy", role: "Psychiatrist (Emotional Intelligence)", location: "Hyderabad", qualification: "MBBS, DNB", phone: "9870000000", charges: "1,500", bio: "Specialist in psychiatry with a focus on emotional intelligence and mental well-being.", clinic: "Reddy Mind Care Center" },
        { id: 9, name: "Dr. Charanya", role: "Counseling Psychologist", location: "Chennai", qualification: "PhD (Psychology)", phone: "9880000000", charges: "2,000+", bio: "Licensed counselor providing empathetic support for emotional and social challenges.", clinic: "Charanya Psychology Lab" },
        { id: 10, name: "Dr. Arnab Ghosh Hajra", role: "Psychiatrist (Clinical)", location: "Kolkata", qualification: "MBBS, MD", phone: "9890000000", charges: "1,500 - 2,000", bio: "Clinical psychiatrist dedicated to evidence-based mental health practices.", clinic: "Ghosh Clinical Mind Center" }
    ];

    const filteredExperts = useMemo(() => {
        return allExperts.filter(expert => {
            const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) || expert.role.toLowerCase().includes(searchQuery.toLowerCase());
            const isAllIndia = selectedCity === t('experts.allIndia') || selectedCity === 'All India';
            const matchesCity = isAllIndia || expert.location === selectedCity;
            return matchesSearch && matchesCity;
        });
    }, [searchQuery, selectedCity]);

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-24 pb-20">
            <div className="max-w-6xl mx-auto text-center mb-16 px-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{t('experts.title1')} <span className="text-accent">{t('experts.title2')}</span></h1>
                <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-lg">
                    {t('experts.subtitle')}
                </p>

                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 bg-surface p-4 rounded-xl border border-border">
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input
                            type="text"
                            placeholder={t('experts.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-accent text-text-primary font-medium placeholder:text-text-secondary transition-colors"
                        />
                    </div>
                    <div className="md:w-64 relative">
                        <Map size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg bg-bg border border-border focus:outline-none focus:border-accent text-text-primary appearance-none cursor-pointer font-medium transition-colors"
                        >
                            {cities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                <AnimatePresence mode="popLayout">
                    {filteredExperts.map((expert) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={expert.id}
                            className={`bg-surface p-6 rounded-xl border flex flex-col hover:border-accent/50 transition-colors ${expert.featured ? 'border-accent' : 'border-border'}`}
                        >
                            <div className="relative mb-6 mx-auto">
                                <div className={`w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold border ${expert.featured ? 'bg-accent/10 text-accent border-accent/20' : 'bg-bg text-text-secondary border-border'}`}>
                                    {expert.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div className={`absolute -bottom-2 -right-2 p-2 rounded-lg text-white ${expert.featured ? 'bg-emerald-500' : 'bg-text-secondary'}`}>
                                    <Award size={16} />
                                </div>
                            </div>

                            <div className="text-center mb-6 flex-grow">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-text-primary leading-tight">{expert.name}</h3>
                                    {expert.featured && <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-accent/20">{t('experts.featured')}</span>}
                                </div>
                                <p className="text-accent text-sm font-medium mb-4">{expert.role}</p>

                                <div className="flex flex-col items-center gap-3 text-sm text-text-secondary font-medium">
                                    <div className="flex items-center gap-2">
                                        <Award size={16} className="text-accent" />
                                        <span>{expert.qualification}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-rose-500" />
                                        <span>{expert.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IndianRupee size={16} className="text-emerald-500" />
                                        <span className="font-bold text-text-primary">₹{expert.charges} {t('experts.session')}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2">
                                <button
                                    onClick={() => setSelectedExpert(expert)}
                                    className="w-full flex items-center justify-center gap-2 bg-bg border border-border text-text-primary py-3 rounded-lg font-bold text-sm hover:bg-surface hover:border-accent/50 transition-colors"
                                >
                                    <Phone size={16} />
                                    {t('experts.bookCall')}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredExperts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-lg text-text-secondary font-medium">{t('experts.noExperts', { city: selectedCity, query: searchQuery })}</p>
                </div>
            )}

            <AnimatePresence>
                {selectedExpert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedExpert(null)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-surface rounded-xl p-8 max-w-md w-full border border-border overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedExpert(null)}
                                className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-bg rounded-lg transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-bg border border-border text-accent rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                    {selectedExpert.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <h3 className="text-xl font-bold text-text-primary mb-1">{selectedExpert.name}</h3>
                                <p className="text-accent font-medium text-sm">{selectedExpert.role}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-bg rounded-xl border border-border space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-surface border border-border rounded-lg text-accent">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest block mb-1">{t('experts.clinicDetails')}</span>
                                            <p className="text-sm font-medium text-text-primary">{selectedExpert.clinic || t('experts.privateClinic')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 border-t border-border pt-4">
                                        <div className="p-2 bg-surface border border-border rounded-lg text-emerald-500">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest block mb-1">{t('experts.contactNum')}</span>
                                            <p className="text-lg font-bold text-text-primary">{selectedExpert.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-xs text-text-secondary font-medium leading-relaxed mb-6">
                                        {t('experts.mention')} <span className="text-accent font-bold">{t('experts.mentionMindPulse')}</span> {t('experts.mentionSuffix')}
                                    </p>

                                    <a
                                        href={`tel:${selectedExpert.phone}`}
                                        className="w-full bg-accent text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors"
                                    >
                                        <Phone size={20} />
                                        {t('experts.callToBook')}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Experts;
