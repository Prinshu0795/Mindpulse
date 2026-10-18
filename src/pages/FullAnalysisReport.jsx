import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Download, AlertTriangle, Activity, BrainCircuit, Moon, Zap, Flame, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const FullAnalysisReport = () => {
    const { user } = useAuth();
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const API_URL = `${BASE_URL.replace(/\/$/, '')}/api`;

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetailedAnalytics = async () => {
            try {
                const token = localStorage.getItem('mindpulse_token');
                const response = await fetch(`${API_URL}/analytics/detailed`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                
                if (data.success) {
                    setAnalytics(data.data);
                } else {
                    setError(data.message || "Failed to load analytics");
                }
            } catch (err) {
                console.error('Error fetching detailed analytics:', err);
                setError("An error occurred while communicating with the server.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchDetailedAnalytics();
        }
    }, [user, API_URL]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-4 bg-bg flex items-center justify-center">
                <div className="flex items-center gap-3 text-text-primary text-xl">
                    <Loader2 size={24} className="animate-spin text-accent" />
                    Loading your personalized analysis...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-4 bg-bg flex flex-col items-center justify-center">
                <AlertTriangle size={48} className="text-red-500 mb-4" />
                <div className="text-text-primary text-xl mb-4">{error}</div>
                <Link to="/dashboard" className="text-accent hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
            </div>
        );
    }

    const { pythonData } = analytics || {};

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const token = localStorage.getItem('mindpulse_token');
            const response = await fetch(`${API_URL}/analytics/report/download`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.message || 'Download failed. Ensure the Python Analytics service is running.');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `MindPulse_Analytics_${user?.name?.replace(/\s+/g, '_') || 'Report'}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Failed to download PDF report. Ensure the Python Analytics Service is running.');
        } finally {
            setIsDownloading(false);
        }
    };

    const hasScores = pythonData?.current_scores && Object.keys(pythonData.current_scores).length > 0;
    const hasSleepEnergy = Boolean(pythonData?.sleep_energy && Object.keys(pythonData.sleep_energy).length > 0);
    const hasTriggers = Boolean(pythonData?.stress_triggers && pythonData.stress_triggers.length > 0);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-bg">
            <div className="max-w-4xl mx-auto">
                <Link to="/dashboard" className="text-text-secondary hover:text-accent inline-flex items-center gap-2 mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Full Data Analysis</h1>
                        <p className="text-sm text-text-secondary mt-1">Deep clinical metrics and predictive patterns powered by AI</p>
                    </div>
                    <button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl font-medium hover:bg-accent/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" /> Generating PDF...
                            </>
                        ) : (
                            <>
                                <Download size={18} /> Download PDF
                            </>
                        )}
                    </button>
                </div>

                {!pythonData ? (
                    <div className="bg-surface rounded-xl p-8 border border-border text-center">
                        <p className="text-text-secondary">Analytics processing service is currently synchronizing.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Assessment Summary Section */}
                        <section className="bg-surface rounded-xl p-8 border border-border">
                            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                                <Activity size={24} className="text-accent" />
                                Assessment Summary
                            </h2>
                            {hasScores ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(pythonData.current_scores).map(([type, data]) => (
                                        <div key={type} className="bg-bg p-4 rounded-xl border border-border">
                                            <div className="text-xs font-bold text-text-secondary uppercase">{type}</div>
                                            <div className="text-2xl font-bold text-accent my-1">{data.score}</div>
                                            <div className="text-sm font-medium text-text-primary">{data.severity}</div>
                                            {pythonData.trends && pythonData.trends[type] && (
                                                <div className={`text-xs mt-2 ${pythonData.trends[type].trend === 'Improving' ? 'text-green-500' : pythonData.trends[type].trend === 'Declining' ? 'text-red-500' : 'text-text-secondary'}`}>
                                                    Trend: {pythonData.trends[type].trend}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-text-secondary">
                                    <p className="mb-3">No standardized assessments recorded yet.</p>
                                    <Link to="/assessments" className="text-accent hover:underline text-sm font-medium">
                                        Take an assessment to generate your baseline →
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Sleep & Energy Metrics */}
                        {hasSleepEnergy && (
                            <section className="bg-surface rounded-xl p-8 border border-border">
                                <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                                    <Moon size={24} className="text-indigo-500" />
                                    Sleep & Energy Dynamics
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-bg p-5 rounded-xl border border-border flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-text-secondary uppercase font-semibold">Average Sleep Quality</p>
                                            <p className="text-3xl font-bold text-indigo-500 mt-1">{pythonData.sleep_energy.average_sleep} <span className="text-sm text-text-secondary font-normal">/ 10</span></p>
                                        </div>
                                        <Moon size={32} className="text-indigo-400 opacity-80" />
                                    </div>
                                    <div className="bg-bg p-5 rounded-xl border border-border flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-text-secondary uppercase font-semibold">Average Energy Level</p>
                                            <p className="text-3xl font-bold text-amber-500 mt-1">{pythonData.sleep_energy.average_energy} <span className="text-sm text-text-secondary font-normal">/ 10</span></p>
                                        </div>
                                        <Zap size={32} className="text-amber-400 opacity-80" />
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Top Stress Triggers */}
                        {hasTriggers && (
                            <section className="bg-surface rounded-xl p-8 border border-border">
                                <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                                    <Flame size={24} className="text-rose-500" />
                                    Identified Stress Triggers
                                </h2>
                                <div className="space-y-3">
                                    {pythonData.stress_triggers.map((trigger, idx) => (
                                        <div key={idx} className="bg-bg p-4 rounded-xl border border-border flex items-center justify-between">
                                            <span className="font-medium text-text-primary">{trigger.name}</span>
                                            <span className="text-xs bg-accent/10 text-accent font-semibold px-3 py-1 rounded-full">
                                                {trigger.count} {trigger.count === 1 ? 'occurrence' : 'occurrences'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Insights Section */}
                        <section className="bg-surface rounded-xl p-8 border border-border">
                            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
                                <BrainCircuit size={24} className="text-indigo-500" />
                                Personalized AI Insights
                            </h2>
                            <div className="space-y-4">
                                {(pythonData.insights || []).map((insight, idx) => (
                                    <div key={idx} className="bg-bg p-4 rounded-xl border border-border text-text-primary flex items-start gap-3">
                                        <Sparkles size={18} className="text-accent mt-0.5 shrink-0" />
                                        <span>{insight}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullAnalysisReport;
