import React from 'react';
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
        icon: <Rocket className="text-accent" />
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
        <section className="py-20 px-4 bg-bg overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-bg border border-border text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <Video size={14} /> Recommended Tools
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary mb-4">
                        More AI Video Tools
                    </h2>
                    <p className="text-text-secondary max-w-2xl mx-auto font-medium">
                        Explore world-class professional tools for image-to-video generation.
                        Perfect for when you need advanced cinematic controls and high-definition results.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <div
                            key={tool.name}
                            className="bg-surface rounded-xl p-6 border border-border flex flex-col h-full hover:border-accent/50 transition-colors"
                        >
                            <div className="mb-6 p-4 bg-bg border border-border rounded-xl w-fit">
                                {tool.icon}
                            </div>

                            <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                                {tool.name}
                            </h3>

                            <p className="text-text-secondary text-sm font-medium mb-8 flex-grow leading-relaxed">
                                {tool.description}
                            </p>

                            <a
                                href={tool.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-bg border border-border hover:bg-surface text-text-primary py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                Use Tool <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}

                    <div className="md:col-span-2 lg:col-span-1 bg-accent rounded-xl p-8 text-white flex flex-col justify-center text-center">
                        <h3 className="text-xl font-bold mb-4">Need Help Choosing?</h3>
                        <p className="text-white/80 text-sm font-medium mb-8 leading-relaxed">
                            Our experts are here to guide you through the best AI creative workflows.
                        </p>
                        <button
                            onClick={() => document.getElementById('experts')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white text-accent py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                        >
                            Consult an Expert
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIVideoTools;
