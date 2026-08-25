import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    ClipboardList,
    Brain,
    CalendarCheck,
    Settings,
    LogOut,
    Shield,
    X
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

const navItems = [
    { section: 'Overview' },
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { section: 'Management' },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/queries', label: 'Contact Queries', icon: MessageSquare },
    { path: '/admin/assessments', label: 'Assessments', icon: ClipboardList },
    { path: '/admin/mental-assessments', label: 'Mental Assessments', icon: Brain },
    { path: '/admin/checkins', label: 'Daily Check-Ins', icon: CalendarCheck },
    { section: 'System' },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAdminAuth();

    const handleNav = (path) => {
        navigate(path);
        if (window.innerWidth < 769) onClose?.();
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 39,
                        display: window.innerWidth >= 769 ? 'none' : 'block'
                    }}
                    onClick={onClose}
                />
            )}

            <aside className={`admin-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
                <div className="admin-sidebar-logo">
                    <Shield size={24} style={{ color: '#4F46E5' }} />
                    <div>
                        <h2>MindPulse</h2>
                    </div>
                    <span>Admin</span>
                    {/* Mobile close button */}
                    <button
                        className="admin-btn-icon"
                        onClick={onClose}
                        style={{ marginLeft: 'auto', display: window.innerWidth < 769 ? 'flex' : 'none' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="admin-sidebar-nav">
                    {navItems.map((item, i) => {
                        if (item.section) {
                            return (
                                <div key={`s-${i}`} className="admin-sidebar-section">
                                    {item.section}
                                </div>
                            );
                        }

                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));

                        return (
                            <div
                                key={item.path}
                                className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
                                onClick={() => handleNav(item.path)}
                            >
                                <Icon size={18} />
                                {item.label}
                            </div>
                        );
                    })}
                </nav>

                <div className="admin-sidebar-footer">
                    <div
                        className="admin-sidebar-link"
                        onClick={handleLogout}
                        style={{ color: '#DC2626', borderLeft: 'none' }}
                    >
                        <LogOut size={18} />
                        Logout
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
