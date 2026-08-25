import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users, ClipboardList, Brain, CalendarCheck, MessageSquare,
    TrendingUp, ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatsCard from './components/StatsCard';
import { useAdminApi } from './hooks/useAdminApi';

const CHART_COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AdminDashboard = ({ setTitle }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { apiCall } = useAdminApi();
    const navigate = useNavigate();

    useEffect(() => {
        setTitle('Dashboard');
        fetchStats();
    }, [setTitle]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await apiCall('/dashboard/stats');
            setStats(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-empty-state">
                <p style={{ color: '#DC2626' }}>Error: {error}</p>
                <button className="admin-btn admin-btn-primary" onClick={fetchStats} style={{ marginTop: '1rem' }}>
                    Retry
                </button>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const registrationData = stats?.charts?.userRegistrationTrend?.map(d => ({
        date: d._id.slice(5), // MM-DD
        users: d.count
    })) || [];

    const moodData = stats?.charts?.moodDistribution?.map(d => ({
        name: d._id,
        value: d.count
    })) || [];

    const assessmentTypeData = stats?.charts?.assessmentTypeDistribution?.map(d => ({
        name: d._id,
        value: d.count
    })) || [];

    return (
        <div>
            {/* Stats Cards */}
            <div className="admin-stats-grid">
                <StatsCard
                    icon={Users}
                    value={stats?.counts?.totalUsers ?? 0}
                    label="Total Users"
                    color="#4F46E5"
                />
                <StatsCard
                    icon={ClipboardList}
                    value={stats?.counts?.totalAssessments ?? 0}
                    label="Stress/Anxiety Assessments"
                    color="#06B6D4"
                />
                <StatsCard
                    icon={Brain}
                    value={stats?.counts?.totalMentalAssessments ?? 0}
                    label="Mental Assessments"
                    color="#10B981"
                />
                <StatsCard
                    icon={CalendarCheck}
                    value={stats?.counts?.totalCheckIns ?? 0}
                    label="Daily Check-Ins"
                    color="#F59E0B"
                />
                <StatsCard
                    icon={MessageSquare}
                    value={stats?.counts?.totalContacts ?? 0}
                    label="Contact Messages"
                    color="#8B5CF6"
                />
            </div>

            {/* Charts */}
            <div className="admin-chart-grid">
                {/* User Registration Trend */}
                <div className="admin-chart-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <TrendingUp size={16} style={{ color: '#4F46E5' }} />
                        User Registrations (Last 30 Days)
                    </h3>
                    {registrationData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={registrationData}>
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '8px',
                                        fontSize: '0.8rem'
                                    }}
                                />
                                <Bar dataKey="users" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="admin-empty-state" style={{ padding: '2rem' }}>
                            <p>No registration data for the last 30 days</p>
                        </div>
                    )}
                </div>

                {/* Assessment Types Distribution */}
                <div className="admin-chart-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Brain size={16} style={{ color: '#10B981' }} />
                        Assessment Types Distribution
                    </h3>
                    {assessmentTypeData.length > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <ResponsiveContainer width="50%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={assessmentTypeData}
                                        dataKey="value"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        innerRadius={35}
                                    >
                                        {assessmentTypeData.map((_, i) => (
                                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ flex: 1 }}>
                                {assessmentTypeData.map((d, i) => (
                                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <div style={{
                                            width: 10, height: 10, borderRadius: '50%',
                                            background: CHART_COLORS[i % CHART_COLORS.length]
                                        }} />
                                        <span style={{ fontSize: '0.8rem', flex: 1 }}>{d.name}</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="admin-empty-state" style={{ padding: '2rem' }}>
                            <p>No assessment data yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Items Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
                {/* Recent Users */}
                <div className="admin-recent-list">
                    <div className="admin-recent-list-header">
                        <h3>Recent Users</h3>
                        <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/users')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    {stats?.recentUsers?.length > 0 ? (
                        stats.recentUsers.map(user => (
                            <div
                                key={user._id}
                                className="admin-recent-item admin-clickable-row"
                                onClick={() => navigate(`/admin/users/${user._id}`)}
                            >
                                <div
                                    className="admin-avatar"
                                    style={{ background: `hsl(${user.name?.charCodeAt(0) * 5 % 360}, 60%, 55%)` }}
                                >
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="admin-recent-item-info">
                                    <div className="admin-recent-item-name">{user.name}</div>
                                    <div className="admin-recent-item-meta">{user.email}</div>
                                </div>
                                <div className="admin-recent-item-date">{formatDate(user.created_at)}</div>
                            </div>
                        ))
                    ) : (
                        <div className="admin-empty-state"><p>No users yet</p></div>
                    )}
                </div>

                {/* Recent Contact Messages */}
                <div className="admin-recent-list">
                    <div className="admin-recent-list-header">
                        <h3>Recent Contact Queries</h3>
                        <button className="admin-btn admin-btn-ghost" onClick={() => navigate('/admin/queries')} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                            View All <ArrowRight size={14} />
                        </button>
                    </div>
                    {stats?.recentContacts?.length > 0 ? (
                        stats.recentContacts.map(msg => (
                            <div key={msg._id} className="admin-recent-item">
                                <div
                                    className="admin-avatar"
                                    style={{ background: `hsl(${msg.name?.charCodeAt(0) * 7 % 360}, 55%, 50%)` }}
                                >
                                    {msg.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="admin-recent-item-info">
                                    <div className="admin-recent-item-name">{msg.subject}</div>
                                    <div className="admin-recent-item-meta">{msg.name} — {msg.email}</div>
                                </div>
                                <div className="admin-recent-item-date">{formatDate(msg.createdAt)}</div>
                            </div>
                        ))
                    ) : (
                        <div className="admin-empty-state"><p>No contact messages yet</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
