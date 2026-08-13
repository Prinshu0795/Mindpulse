import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Clock, Calendar } from 'lucide-react';
import { blogArticles } from '../data/blogData';
import { useTranslation } from 'react-i18next';

const categories = ['All', 'Stress', 'Anxiety', 'Sleep', 'Student Wellness', 'Self-Care', 'Productivity'];

const Blog = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredArticles = blogArticles.filter(article => {
        const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredArticle = blogArticles[0];

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-24 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        MindPulse <span className="text-accent">{t('blog.title')}</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl mx-auto text-lg mb-10">
                        {t('blog.subtitle')}
                    </p>

                    <div className="max-w-md mx-auto relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                        <input
                            type="text"
                            placeholder={t('blog.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:border-accent text-text-primary"
                        />
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    activeCategory === cat 
                                        ? 'bg-accent text-white border-accent' 
                                        : 'bg-surface text-text-secondary border-border hover:border-accent hover:text-text-primary'
                                } border`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Article */}
                {searchQuery === '' && activeCategory === 'All' && (
                    <div className="mb-16">
                        <Link to={`/blog/${featuredArticle.slug}`} className="block group">
                            <div className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-accent/50 transition-colors">
                                <div className="md:w-1/2 bg-accent/10 p-8 flex items-center justify-center min-h-[250px]">
                                    {/* Placeholder for featured image */}
                                    <div className="text-accent font-black text-6xl opacity-20">MindPulse</div>
                                </div>
                                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                    <span className="text-accent font-bold text-sm uppercase tracking-widest mb-3">
                                        {t('blog.featured')} • {featuredArticle.category}
                                    </span>
                                    <h2 className="text-3xl font-bold text-text-primary mb-4 group-hover:text-accent transition-colors">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="text-text-secondary text-lg mb-6">
                                        {featuredArticle.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                                        <span className="flex items-center gap-1"><Calendar size={16}/> {featuredArticle.date}</span>
                                        <span className="flex items-center gap-1"><Clock size={16}/> {featuredArticle.readTime}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={article.id}
                        >
                            <Link to={`/blog/${article.slug}`} className="block bg-surface border border-border rounded-2xl p-6 h-full hover:border-accent/50 transition-colors group flex flex-col">
                                <span className="text-accent font-bold text-xs uppercase tracking-widest mb-3 block">
                                    {article.category}
                                </span>
                                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                                    {article.title}
                                </h3>
                                <p className="text-text-secondary mb-6 flex-grow">
                                    {article.excerpt}
                                </p>
                                <div className="flex items-center justify-between text-sm text-text-secondary mt-auto pt-4 border-t border-border">
                                    <span className="flex items-center gap-1"><Calendar size={14}/> {article.date}</span>
                                    <span className="flex items-center gap-1"><Clock size={14}/> {article.readTime}</span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
                
                {filteredArticles.length === 0 && (
                    <div className="text-center py-20 text-text-secondary">
                        {t('blog.noArticles')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
