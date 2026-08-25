import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, ClipboardList, Brain, CalendarCheck, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import ConfirmDialog from './components/ConfirmDialog';
import EditModal from './components/EditModal';
import { useAdminApi } from './hooks/useAdminApi';
import { useToast } from './components/Toast';

const AdminUserDetail = ({ setTitle }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { apiCall } = useAdminApi();
    const { addToast } = useToast();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [editUser, setEditUser] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteType, setDeleteType] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => { setTitle('User Detail'); }, [setTitle]);

    useEffect(() => { fetchUser(); }, [id]);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const result = await apiCall(`/users/${id}`);
            setData(result.data);
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = async (formData) => {
        try {
            setSaving(true);
            await apiCall(`/users/${id}`, { method: 'PUT', body: formData });
            addToast('User updated successfully', 'success');
            setEditUser(false);
            fetchUser();
        } catch (err) {
            addToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await apiCall(`/users/${id}`, { method: 'DELETE' });
            addToast('User deleted successfully', 'success');
            navigate('/admin/users');
        } catch (err) {
            addToast(err.message, 'error');
        }
        setDeleteTarget(null);
    };

    const handleDeleteItem = async () => {
        if (!deleteTarget || !deleteType) return;
        const endpoints = {
            assessment: '/assessments',
            mentalAssessment: '/mental-assessments',
            checkin: '/checkins',
            contact: '/contacts'
        };
        try {
            await apiCall(`${endpoints[deleteType]}/${deleteTarget._id}`, { method: 'DELETE' });
            addToast('Deleted successfully', 'success');
            setDeleteTarget(null);
            setDeleteType('');
            fetchUser();
        } catch (err) {
            addToast(err.message, 'error');
        }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }) : '—';

    if (loading) {
        return <div className="admin-loading"><div className="admin-spinner" /></div>;
    }

    if (!data?.user) {
        return (
            <div className="admin-empty-state">
                <p>User not found</p>
                <button className="admin-btn admin-btn-primary" onClick={() => navigate('/admin/users')} style={{ marginTop: '1rem' }}>
                    Back to Users
                </button>
            </div>
        );
    }

    const { user, assessments, mentalAssessments, dailyCheckIns, contactMessages } = data;

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'assessments', label: `Assessments (${assessments?.length || 0})`, icon: ClipboardList },
        { id: 'mental', label: `Mental (${mentalAssessments?.length || 0})`, icon: Brain },
        { id: 'checkins', label: `Check-Ins (${dailyCheckIns?.length || 0})`, icon: CalendarCheck },
        { id: 'queries', label: `Queries (${contactMessages?.length || 0})`, icon: MessageSquare },
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button className="admin-btn admin-btn-secondary" onClick={() => navigate('/admin/users')}>
                    <ArrowLeft size={16} /> Back
                </button>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{user.name}</h2>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{user.email}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="admin-btn admin-btn-secondary" onClick={() => setEditUser(true)}>
                        <Edit2 size={14} /> Edit
                    </button>
                    <button className="admin-btn admin-btn-danger" onClick={() => { setDeleteTarget(user); setDeleteType('user'); }}>
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={14} style={{ marginRight: '0.375rem' }} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="admin-detail-card">
                    <h3>User Information</h3>
                    <div className="admin-detail-row">
                        <span className="admin-detail-label">User ID</span>
                        <span className="admin-detail-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{user._id}</span>
                    </div>
                    <div className="admin-detail-row">
                        <span className="admin-detail-label">Name</span>
                        <span className="admin-detail-value">{user.name}</span>
                    </div>
                    <div className="admin-detail-row">
                        <span className="admin-detail-label">Email</span>
                        <span className="admin-detail-value">{user.email}</span>
                    </div>
                    <div className="admin-detail-row">
                        <span className="admin-detail-label">Registered</span>
                        <span className="admin-detail-value">{formatDate(user.created_at)}</span>
                    </div>
                    <div className="admin-detail-row">
                        <span className="admin-detail-label">Total Assessments</span>
                        <span className="admin-detail-value">{assessments?.length || 0}</span>
                    </div>
                    <div className="admin-detail-row">
                        <span className="admin-detail-label">Total Mental Assessments</span>
                        <span className="admin-detail-value">{mentalAssessments?.length || 0}</span>
                    </div>
                    <div className="admin-detail-row">
                        <span className="admin-detail-label">Total Check-Ins</span>
                        <span className="admin-detail-value">{dailyCheckIns?.length || 0}</span>
                    </div>
                </div>
            )}

            {/* Assessments Tab */}
            {activeTab === 'assessments' && (
                <div className="admin-table-wrapper">
                    {assessments?.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead><tr>
                                    <th>Date</th><th>Stress</th><th>Anxiety</th><th>Trigger</th><th>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {assessments.map(a => (
                                        <tr key={a._id}>
                                            <td>{formatDate(a.fullDate || a.createdAt)}</td>
                                            <td><span className="admin-badge admin-badge-red">{a.stress}</span></td>
                                            <td><span className="admin-badge admin-badge-amber">{a.anxiety}</span></td>
                                            <td>{a.trigger || '—'}</td>
                                            <td>
                                                <button className="admin-btn-icon" onClick={() => { setDeleteTarget(a); setDeleteType('assessment'); }} style={{ color: '#DC2626' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="admin-empty-state"><p>No assessments for this user</p></div>
                    )}
                </div>
            )}

            {/* Mental Assessments Tab */}
            {activeTab === 'mental' && (
                <div className="admin-table-wrapper">
                    {mentalAssessments?.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead><tr>
                                    <th>Type</th><th>Score</th><th>Severity</th><th>Date</th><th>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {mentalAssessments.map(a => (
                                        <tr key={a._id}>
                                            <td><span className="admin-badge admin-badge-indigo">{a.type}</span></td>
                                            <td>{a.score ?? (a.subScores ? `D:${a.subScores.depression} A:${a.subScores.anxiety} S:${a.subScores.stress}` : '—')}</td>
                                            <td>{a.severity || '—'}</td>
                                            <td>{formatDate(a.completedAt)}</td>
                                            <td>
                                                <button className="admin-btn-icon" onClick={() => { setDeleteTarget(a); setDeleteType('mentalAssessment'); }} style={{ color: '#DC2626' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="admin-empty-state"><p>No mental assessments for this user</p></div>
                    )}
                </div>
            )}

            {/* Check-Ins Tab */}
            {activeTab === 'checkins' && (
                <div className="admin-table-wrapper">
                    {dailyCheckIns?.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead><tr>
                                    <th>Date</th><th>Mood</th><th>Stress</th><th>Anxiety</th><th>Energy</th><th>Sleep</th><th>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {dailyCheckIns.map(c => (
                                        <tr key={c._id}>
                                            <td>{formatDate(c.createdAt)}</td>
                                            <td><span className="admin-badge admin-badge-green">{c.mood}</span></td>
                                            <td>{c.stressLevel}/10</td>
                                            <td>{c.anxietyLevel}/10</td>
                                            <td>{c.energyLevel}/10</td>
                                            <td>{c.sleepQuality}/10</td>
                                            <td>
                                                <button className="admin-btn-icon" onClick={() => { setDeleteTarget(c); setDeleteType('checkin'); }} style={{ color: '#DC2626' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="admin-empty-state"><p>No daily check-ins for this user</p></div>
                    )}
                </div>
            )}

            {/* Queries Tab */}
            {activeTab === 'queries' && (
                <div className="admin-table-wrapper">
                    {contactMessages?.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead><tr>
                                    <th>Subject</th><th>Message</th><th>Date</th><th>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {contactMessages.map(m => (
                                        <tr key={m._id}>
                                            <td style={{ fontWeight: 600 }}>{m.subject}</td>
                                            <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</td>
                                            <td>{formatDate(m.createdAt)}</td>
                                            <td>
                                                <button className="admin-btn-icon" onClick={() => { setDeleteTarget(m); setDeleteType('contact'); }} style={{ color: '#DC2626' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="admin-empty-state"><p>No contact queries from this user</p></div>
                    )}
                </div>
            )}

            {/* Edit User Modal */}
            <EditModal
                isOpen={editUser}
                title="Edit User"
                fields={[
                    { key: 'name', label: 'Name', type: 'text' },
                    { key: 'email', label: 'Email', type: 'email' }
                ]}
                initialData={user}
                onSave={handleEditUser}
                onClose={() => setEditUser(false)}
                saving={saving}
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                title={deleteType === 'user' ? 'Delete User' : 'Delete Record'}
                message={
                    deleteType === 'user'
                        ? `Are you sure you want to delete "${user.name}"? All related data will be permanently removed.`
                        : 'Are you sure you want to delete this record? This action cannot be undone.'
                }
                confirmText="Delete"
                onConfirm={deleteType === 'user' ? handleDeleteUser : handleDeleteItem}
                onCancel={() => { setDeleteTarget(null); setDeleteType(''); }}
            />
        </div>
    );
};

export default AdminUserDetail;
