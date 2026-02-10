import React, { useState, useMemo } from 'react';
import { Phone, MapPin, Award, IndianRupee, X, Calendar, User, Search, Map, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExpertsSection = () => {
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("All India");

    const cities = ["All India", "Lucknow", "Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Kolkata", "Chennai"];

    const allExperts = [
        {
            id: 1,
            name: "Dr. Isha Sherma",
            role: "Senior Psychologist",
            location: "Lucknow",
            qualification: "Gold Medalist in Psychology",
            phone: "7054265144",
            charges: "800",
            bio: "Specializing in mental well-being and emotional resilience with years of clinical experience.",
            clinic: "Isha's Healing Center, Hazratganj",
            featured: true
        },
        {
            id: 2,
            name: "Dr. Samir Parikh",
            role: "Psychiatrist (Mental Health)",
            location: "Delhi",
            qualification: "MBBS, MD, DPM",
            phone: "9811000000",
            charges: "1,500+",
            bio: "Renowned psychiatrist specializing in mental health and community outreach programs.",
            clinic: "Fortis Memorial Research Institute"
        },
        {
            id: 3,
            name: "Dr. Ajit Dandekar",
            role: "Psychiatrist (Stress Mgmt)",
            location: "Mumbai",
            qualification: "MBBS, MD, DPM",
            phone: "9820000000",
            charges: "2,000+",
            bio: "Expert in clinical psychiatry and stress management for busy professionals.",
            clinic: "Dandekar's Psychiatric Clinic"
        },
        {
            id: 4,
            name: "Sachin Bhatnagar",
            role: "Top Rated Career Counselor",
            location: "Mumbai",
            qualification: "Career Coach",
            phone: "9830000000",
            charges: "2,500+",
            bio: "Guiding students and professionals towards fulfilling careers with expert coaching.",
            clinic: "Career Hub International"
        },
        {
            id: 5,
            name: "Dr. Ravi Prakash",
            role: "Psychiatrist (De-addiction)",
            location: "Bangalore",
            qualification: "MBBS, MD, DPM",
            phone: "9840000000",
            charges: "750 - 1,200",
            bio: "Dedicated specialist in de-addiction and rehabilitation therapies.",
            clinic: "Prakash De-addiction & Rehab"
        },
        {
            id: 6,
            name: "Dr. M.B. Pethe",
            role: "Senior Psychiatrist",
            location: "Pune",
            qualification: "MBBS, MD",
            phone: "9850000000",
            charges: "1,000",
            bio: "Experienced senior psychiatrist focusing on comprehensive clinical care.",
            clinic: "Pethe Clinic & Counseling Center"
        },
        {
            id: 7,
            name: "Amritansh Tiwari",
            role: "Career Counselor & Trainer",
            location: "Pune",
            qualification: "Career Expert",
            phone: "9860000000",
            charges: "1,000/hr",
            bio: "Empowering individuals through professional career guidance and training skills.",
            clinic: "Tiwari Career Academy"
        },
        {
            id: 8,
            name: "Dr. S. Swetha Reddy",
            role: "Psychiatrist (Emotional Intelligence)",
            location: "Hyderabad",
            qualification: "MBBS, DNB",
            phone: "9870000000",
            charges: "1,500",
            bio: "Specialist in psychiatry with a focus on emotional intelligence and mental well-being.",
            clinic: "Reddy Mind Care Center"
        },
        {
            id: 9,
            name: "Dr. Charanya",
            role: "Counseling Psychologist",
            location: "Chennai",
            qualification: "PhD (Psychology)",
            phone: "9880000000",
            charges: "2,000+",
            bio: "Licensed counselor providing empathetic support for emotional and social challenges.",
            clinic: "Charanya Psychology Lab"
        },
        {
            id: 10,
            name: "Dr. Arnab Ghosh Hajra",
            role: "Psychiatrist (Clinical)",
            location: "Kolkata",
            qualification: "MBBS, MD",
            phone: "9890000000",
            charges: "1,500 - 2,000",
            bio: "Clinical psychiatrist dedicated to evidence-based mental health practices.",
            clinic: "Ghosh Clinical Mind Center"
        }
    ];

    const filteredExperts = useMemo(() => {
        return allExperts.filter(expert => {
            const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                expert.role.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = selectedCity === "All India" || expert.location === selectedCity;
            return matchesSearch && matchesCity;
        });
    }, [searchQuery, selectedCity]);

    return (
        <section id="experts" className="py-24 px-4 bg-sand/30 dark:bg-navy/20 scroll-mt-20">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-slate dark:text-sage mb-4"
                >
                    Find Verified Experts
                </motion.h2>
                <p className="text-slate-500 dark:text-sage/60 max-w-2xl mx-auto mb-10 font-medium">
                    Call directly to book your session with India's top mental health professionals.
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700"
                >
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or specialty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-700 dark:text-slate-200 font-medium placeholder:text-slate-400"
                        />
                    </div>
                    <div className="md:w-64 relative">
                        <Map size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-700 dark:text-slate-200 appearance-none cursor-pointer font-medium"
                        >
                            {cities.map(city => (
                                <option key={city} value={city} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{city}</option>
                            ))}
                        </select>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                <AnimatePresence mode="popLayout">
                    {filteredExperts.map((expert) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -10 }}
                            key={expert.id}
                            className={`bg-white dark:bg-slate p-8 rounded-[2.5rem] shadow-2xl border flex flex-col ${expert.featured ? 'border-sky/50 ring-2 ring-sky/10' : 'border-sage/20 dark:border-slate/10'}`}
                        >
                            <div className="relative mb-6 mx-auto">
                                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-black shadow-lg ${expert.featured ? 'bg-sky text-slate-800' : 'bg-sage/10 text-sky-600'}`}>
                                    {expert.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div className={`absolute -bottom-2 -right-2 p-2 rounded-xl text-white ${expert.featured ? 'bg-emerald-500 shadow-emerald-500/20 shadow-lg' : 'bg-slate-400'}`}>
                                    <Award size={18} />
                                </div>
                            </div>

                            <div className="text-center mb-6 flex-grow">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{expert.name}</h3>
                                    {expert.featured && <span className="text-[9px] bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter border border-sky-200 dark:border-sky-800">Featured</span>}
                                </div>
                                <p className="text-sky-600 dark:text-sky-400 text-sm font-bold mb-4">{expert.role}</p>

                                <div className="flex flex-col items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Award size={14} className="text-sky-500" />
                                        <span className="font-bold">{expert.qualification}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-red-400" />
                                        <span className="font-bold">{expert.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <IndianRupee size={14} className="text-emerald-500" />
                                        <span className="font-black text-slate-900 dark:text-white">₹{expert.charges} Session</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 mt-4">
                                <button
                                    onClick={() => setSelectedExpert(expert)}
                                    className="w-full flex items-center justify-center gap-3 bg-slate-800 dark:bg-sky text-white dark:text-slate-900 py-4 rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform shadow-xl"
                                >
                                    <Phone size={18} />
                                    Book via Call
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredExperts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-xl text-slate-400 font-medium">No experts found in {selectedCity} matching "{searchQuery}".</p>
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
                            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white dark:bg-slate rounded-[3rem] p-8 max-w-md w-full shadow-2xl border border-sage/20 dark:border-slate/10 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky/10 blur-3xl -mr-16 -mt-16" />

                            <button
                                onClick={() => setSelectedExpert(null)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-sage transition-colors z-10"
                            >
                                <X size={24} />
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-sky/20 text-sky-600 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-6">
                                    {selectedExpert.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <h3 className="text-2xl font-black text-slate dark:text-sage mb-1">{selectedExpert.name}</h3>
                                <p className="text-sky-600 font-bold text-sm tracking-tight">{selectedExpert.role}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-sage/5 dark:bg-navy/30 rounded-3xl border border-sage/10 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-white dark:bg-slate rounded-xl shadow-sm text-sky-600">
                                            <Building2 size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-0.5">Clinic Details</span>
                                            <p className="text-sm font-bold text-slate-700 dark:text-sage">{selectedExpert.clinic || "Private Clinic"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 border-t border-sage/10 pt-4">
                                        <div className="p-2 bg-white dark:bg-slate rounded-xl shadow-sm text-emerald-500">
                                            <Phone size={20} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-0.5">Contact Number</span>
                                            <p className="text-lg font-black text-slate-800 dark:text-sage tracking-wider">{selectedExpert.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center px-4">
                                    <p className="text-xs text-slate-500 dark:text-sage/60 font-medium leading-relaxed mb-8">
                                        Please mention <span className="text-sky-600 font-bold">MindPulse</span> while calling to avail special priority session booking.
                                    </p>

                                    <a
                                        href={`tel:${selectedExpert.phone}`}
                                        className="w-full bg-emerald-500 text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-emerald-500/20"
                                    >
                                        <Phone size={24} />
                                        Call to Book Now
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default ExpertsSection;
