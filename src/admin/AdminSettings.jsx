import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, Database, Server } from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext';

const AdminSettings = ({ setTitle }) => {
    const { admin, logout } = useAdminAuth();
    const navigate = useNavigate();

    useEffect(() => { setTitle('Settings'); }, [setTitle]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div style={{ maxWidth: '640px' }}>
            {/* Admin Info */}
            <div className="admin-detail-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={18} style={{ color: '#4F46E5' }} />
                    Admin Account
                </h3>
                <div className="admin-detail-row">
                    <span className="admin-detail-label">Name</span>
                    <span className="admin-detail-value">{admin?.name || '—'}</span>
                </div>
                <div className="admin-detail-row">
                    <span className="admin-detail-label">Email</span>
                    <span className="admin-detail-value">{admin?.email || '—'}</span>
                </div>
                <div className="admin-detail-row">
                    <span className="admin-detail-label">Role</span>
                    <span className="admin-detail-value">
                        <span className="admin-badge admin-badge-indigo">Administrator</span>
                    </span>
                </div>
            </div>

            {/* System Info */}
            <div className="admin-detail-card">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Server size={18} style={{ color: '#06B6D4' }} />
                    System Information
                </h3>
                <div className="admin-detail-row">
                    <span className="admin-detail-label">Application</span>
                    <span className="admin-detail-value">MindPulse</span>
                </div>
                <div className="admin-detail-row">
                    <span className="admin-detail-label">Database</span>
                    <span className="admin-detail-value">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <Database size={14} /> MongoDB Atlas
                        </span>
                    </span>
                </div>
                <div className="admin-detail-row">
                    <span className="admin-detail-label">Frontend</span>
                    <span className="admin-detail-value">React + Vite</span>
                </div>
                <div className="admin-detail-row">
                    <span className="admin-detail-label">Backend</span>
                    <span className="admin-detail-value">Express.js + Node.js</span>
                </div>
            </div>

            {/* Logout */}
            <button
                className="admin-btn admin-btn-danger"
                onClick={handleLogout}
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
            >
                <LogOut size={18} />
                Sign Out of Admin Panel
            </button>
        </div>
    );
};

export default AdminSettings;
