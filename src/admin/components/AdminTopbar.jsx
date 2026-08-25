import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';

const AdminTopbar = ({ title, onToggleSidebar }) => {
    const { admin, logout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-topbar">
            <div className="admin-topbar-left">
                <button className="admin-btn-icon" onClick={onToggleSidebar}>
                    <Menu size={20} />
                </button>
                <div>
                    <h1>{title || 'Dashboard'}</h1>
                </div>
            </div>
            <div className="admin-topbar-right">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                        className="admin-avatar"
                        style={{ background: 'linear-gradient(135deg, #4F46E5, #818CF8)' }}
                    >
                        {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{admin?.name || 'Admin'}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Administrator</span>
                    </div>
                </div>
                <button className="admin-btn-icon" onClick={handleLogout} title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};

export default AdminTopbar;
