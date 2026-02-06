import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Video, Sparkles, Wand2, Zap, Rocket, Star } from 'lucide-react';

const tools = [
    {
        name: "Runway Gen-2",
        description: "Industry-leading AI video generation with multimotion and cinematic control.",
        link: "https://runwayml.com/",
        icon: <Sparkles className="text-purple-500" />
    },
    {
        name: "Luma Dream Machine",
        description: "Create high-quality, realistic videos from images with incredible temporal consistency.",
        link: "https://lumalabs.ai/dream-machine",
        icon: <Rocket className="text-sky-500" />
    },
    {
        name: "Kling AI",
        description: "Advanced video generation capable of creating long, high-definition cinematic shots.",
        link: "https://klingai.com/",
        icon: <Zap className="text-amber-500" />
    },
    {
        name: "Pika Art",
        description: "Transform your ideas into animations. Specially great for stylized and artistic videos.",
        link: "https://pika.art/",
        icon: <Wand2 className="text-pink-500" />
    },
    {
        name: "Leonardo AI",
        description: "Full creative suite offering motion generation and high-quality image-to-video tools.",
        link: "https://leonardo.ai/",
        icon: <Star className="text-emerald-500" />
    }
];

const AIVideoTools = () => {
    return (
        <section className="py-20 px-4 bg-sage/5 dark:bg-navy/10 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-sky/10 text-sky-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                        <Video size={14} /> Recommended Tools
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate dark:text-sage mb-4">
                        More AI Video <span className="text-sky-600">Magic</span>
                    </h2>
                    <p className="text-slate-500 dark:text-sage/60 max-w-2xl mx-auto font-medium">
                        Explore world-class professional tools for image-to-video generation.
                        Perfect for when you need advanced cinematic controls and high-definition results.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool, index) => (
                        <motion.div
                            key={tool.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-slate group hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] p-8 border border-sage/10 dark:border-slate/10 flex flex-col h-full relative overflow-hidden"
                        >
                            {/* Background Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky/5 rounded-full blur-3xl group-hover:bg-sky/10 transition-colors" />

                            <div className="mb-6 p-4 bg-sage/5 dark:bg-navy/30 rounded-3xl w-fit group-hover:scale-110 transition-transform duration-500">
                                {tool.icon}
                            </div>

                            <h3 className="text-2xl font-black text-slate dark:text-sage mb-3 flex items-center gap-2 leading-none">
                                {tool.name}
                            </h3>

                            <p className="text-slate-500 dark:text-sage/60 text-sm font-medium mb-8 flex-grow leading-relaxed">
                                {tool.description}
                            </p>

                            <a
                                href={tool.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-slate-50 dark:bg-navy/40 hover:bg-sky hover:text-white dark:hover:bg-sky text-slate-600 dark:text-sage/80 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all group-hover:shadow-lg active:scale-95"
                            >
                                Use Tool <ExternalLink size={16} />
                            </a>
                        </motion.div>
                    ))}

                    {/* Bonus Contact Support Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="md:col-span-2 lg:col-span-1 bg-gradient-to-br from-sky to-sky-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-center text-center shadow-xl shadow-sky/20"
                    >
                        <h3 className="text-2xl font-black mb-4">Need Help Choosing?</h3>
                        <p className="text-white/80 text-sm font-medium mb-8 leading-relaxed">
                            Our experts are here to guide you through the best AI creative workflows.
                        </p>
                        <button
                            onClick={() => document.getElementById('experts')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white text-sky-600 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:shadow-xl transition-all active:scale-95"
                        >
                            Consult an Expert
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AIVideoTools;
