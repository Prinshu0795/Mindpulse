import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { blogArticles } from '../data/blogData';
import { motion } from 'framer-motion';

const BlogPost = () => {
    const { slug } = useParams();
    const article = blogArticles.find(a => a.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!article) {
        return (
            <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Article Not Found</h2>
                <Link to="/blog" className="text-accent font-medium hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Blog
                </Link>
            </div>
        );
    }

    const relatedArticles = blogArticles
        .filter(a => a.category === article.category && a.id !== article.id)
        .slice(0, 2);

    return (
        <div className="min-h-screen bg-bg text-text-primary pt-24 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
                <Link to="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors font-medium mb-10">
                    <ArrowLeft size={18} /> Back to Journal
                </Link>

                <motion.article 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-10 text-center">
                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block">
                            {article.category}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-sm text-text-secondary font-medium">
                            <span className="flex items-center gap-2"><Calendar size={16}/> {article.date}</span>
                            <span className="flex items-center gap-2"><Clock size={16}/> {article.readTime}</span>
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-2xl p-8 md:p-12 prose prose-lg dark:prose-invert max-w-none text-text-secondary leading-relaxed">
                        {/* Render simple markdown-like content for placeholder */}
                        {article.content.split('\n\n').map((paragraph, idx) => {
                            if (paragraph.startsWith('###')) {
                                return <h3 key={idx} className="text-xl font-bold text-text-primary mt-8 mb-4">{paragraph.replace('### ', '')}</h3>;
                            }
                            if (paragraph.startsWith('* ')) {
                                return (
                                    <ul key={idx} className="list-disc pl-6 mb-4 space-y-2">
                                        {paragraph.split('\n').map((item, i) => (
                                            <li key={i}>{item.replace('* ', '')}</li>
                                        ))}
                                    </ul>
                                );
                            }
                            if (paragraph.trim() !== '') {
                                return <p key={idx} className="mb-4">{paragraph}</p>;
                            }
                            return null;
                        })}
                    </div>
                </motion.article>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedArticles.map((rel) => (
                                <Link to={`/blog/${rel.slug}`} key={rel.id} className="block bg-surface border border-border rounded-2xl p-6 hover:border-accent/50 transition-colors group">
                                    <span className="text-accent font-bold text-xs uppercase tracking-widest mb-3 block">
                                        {rel.category}
                                    </span>
                                    <h4 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                                        {rel.title}
                                    </h4>
                                    <p className="text-sm text-text-secondary">
                                        {rel.excerpt}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPost;
